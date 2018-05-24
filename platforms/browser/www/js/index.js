/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*jshint esversion: 6 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      this.receivedEvent('deviceready');
      this.init_db();


    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        var syncdbElement = parentElement.querySelector('.syncdb');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    received_db: function (id){
      var parentElement = document.getElementById(id);
      var syncronized_dbElement = parentElement.querySelector('.syncronized_db');
      var syncronizing_dbElement = parentElement.querySelector('.syncronizing_db');
      syncronizing_dbElement.setAttribute('style','display:none;');
      syncronized_dbElement.setAttribute('style','display:block;');
      console.log('fim da replicacao: '+ new Date().toUTCString());
    },
    init_db: function () {
      var remote_db = PouchDB("http://207.246.115.175:5984/crypto_db");
      remote_db.info().then(function (info) {
        //console.log(info);
      });
      var local_db = new PouchDB('crypto.db');
      //this.sync_db(local_db, remote_db);

      //this.test().then(function (res) {
      //  console.log('then ok, res='+res);
      //});


      try {
        this.sync_db(local_db, remote_db).then(function (res) {
          console.log('inicio da replicacao: '+ new Date().toUTCString());
        });

        //this.getData('bit',local_db);
        this.getDataMap(local_db);
        //this.getData2('bit',local_db);
        //this.getDataSearch(local_db); workfine

        //this.setMap(remote_db);


      } catch (err) {
        console.log(err);
      }



    },
    getDataSearch: function (db) {
      db.search({
        query: 'bit',
        fields: ['full_name', 'algorithm', 'image_url'],
        include_docs: true,
        build: true
      }).then(function (res) {
        //console.log(res);
        console.log(res.full_name);
      }).catch(function (err) {
        console.log(err);
      });

    },
    getDataMap: function (db){


      db.query(function (doc, emit) {
        if (doc.full_name.toLowerCase().indexOf('btc')>-1) {
          emit(true);
        }
      }, {
        include_docs: true,
        attachments: true,
        key: true,
      }).then(function (doc) {
        // found docs with name === 'foo'
        console.log(doc);
        //for (var i in doc.full_name) {
        //  emit([doc.value, Number(i)+1], {_id: doc.ancestors[i]});
        //}

      }).catch(function (err) {
        // handle any errors
        console.log(err);
      });

    },
    getData: function (str, db){
      db.query(function (doc, emit) {
        emit(doc.full_name, doc._id);
      }, {
        include_docs: true,
        attachments: true,
        startkey: 'BTC',
        endkey: 'BTC\ufff0'
      }).then(function (doc) {
        // found docs with name === 'foo'
        console.log(doc);
        //for (var i in doc.full_name) {
        //  emit([doc.value, Number(i)+1], {_id: doc.ancestors[i]});
        //}

      }).catch(function (err) {
        // handle any errors
        console.log(err);
      });

    },
    setMap: function(db){
      var ddoc = {
        _id: '_design/full_name',
        views: {
          full_name: {
            map: function (doc) { emit(doc.full_name); }.toString()
          }
        }
      };
      // save it
      db.put(ddoc).then(function () {
        console.log('index criado!');
      }).catch(function (err) {
        console.log(err);
      });

    },
    getData2: function (str, db){
      db.createIndex({
        index: {
          fields: ['full_name'],
          ddoc: 'my-index',
          name: 'my-index',
          type: 'json'
        }
      }).then(function (res) {
        console.log(res);
        return db.find({
          selector: {
            full_name: {$regex: RegExp(str, 'i')}
          }, use_index:'_design/my-index'
        }).then((res) => {
          console.log(res);

        }).catch ((err) => {
          console.log(err);
        });
      });

    },
    sync_db: function (local, remote){
        return new Promise((resolve, reject) => {

          local.replicate.from(remote)
            .on('complete', function (info) {app.received_db('deviceready');})
            .on('error', console.error);

          var res = 'rest externo';
          resolve(res);
        });

    },

    test: function () {
      return new Promise((resolve, reject) => {
          var res = "Promisse ok";
          resolve(res);
      });
    }
};
//PouchDB.plugin(require('pouchdb-quick-search'));

app.initialize();
