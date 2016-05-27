var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;

var connections = require('./connections');

var jobs = [
    {queue: 'jobs.notify', handler: 'job-nofify'},
    {queue: 'jobs.vote', handler: 'job-vote'}
];

var job = {queue: 'jobs.notify', handler: 'job-nofify'};

function App(config) {
    EventEmitter.call(this);

    this.config = config;
    this.connections = connections(config.mongo_url, config.rabbit_url);
    this.connections.once('ready', this.onConnected.bind(this));
    this.connections.once('lost', this.onLost.bind(this));
}

module.exports = function createApp(config) {
    return new App(config);
};

App.prototype = Object.create(EventEmitter.prototype);

App.prototype.onConnected = function() {
    var queues = 0;
    //this.connections.db, this.config.mongo_cache;

    //init queues
    var that = this;
    jobs.forEach(function(job){
        logger.log({ type: 'info', queue: job.queue, msg: 'create' });
        that.connections.queue.create(job.queue, { prefetch: 5 }, onCreate.bind(that));
    });

    function onCreate() {
        if (++queues === 2) this.onReady();
    }
};

App.prototype.onReady = function() {
    logger.log({ type: 'info', msg: 'app.ready' });
    this.publish('jobs.notify', {data: 123});

    this.emit('ready');
};

App.prototype.onLost = function() {
    logger.log({ type: 'info', msg: 'app.lost' });
    this.emit('lost');
};

App.prototype.start = function() {
    var that = this;
    jobs.forEach(function(job){
        that.connections.queue.handle(job.queue, handle);
    });

    var that = this;
    function handle(data, ack) {
        that.handleJob(that.test, data, ack);
    }

    return this;
};

App.prototype.handleJob = function(handler, data, ack) {
    logger.log({ type: 'info', msg: 'handling job' });

    try {
        handler()
            .then(onSuccess, onError);
    }
    catch(err){
        console.log(err);
    }

    function onSuccess() {
        logger.log({ type: 'info', msg: 'job complete', queue: job.queue, status: 'success' });
        ack();
    }

    function onError(err) {
        logger.log({ type: 'info', msg: 'job complete', queue: job.queue, status: 'failure', error: err });
        ack();
    }
};

App.prototype.purge = function(queue) {
    logger.log({ type: 'info', queue: queue, msg: 'purge' });

    return new Promise(function(resolve, reject) {
        this.connections.queue.purge(queue, onPurge);

        function onPurge(err, count) {
            if (err) return reject(err);
            resolve(count);
        }
    }.bind(this));
};

App.prototype.publish = function(queue, data) {
    logger.log({ type: 'info', queue: queue, msg: 'app.publish' });
    this.connections.queue.publish(queue, data);
    return Promise.resolve(data);
};

App.prototype.stop = function() {
    jobs.forEach(function(job){
        this.connections.queue.ignore(job);
    });
    return this;
};

App.prototype.test = function() {
    return new Promise(function(resolve, reject) {
        logger.log({ type: 'info', msg: 'test' });
        resolve();
    }.bind(this));
}