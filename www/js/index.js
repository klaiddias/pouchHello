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
        console.log(info);
      });
      var local_db = new PouchDB('crypto.db');
      //this.sync_db(local_db, remote_db);

      //this.test().then(function (res) {
      //  console.log('then ok, res='+res);
      //});


      this.sync_db(local_db, remote_db).then(function (res) {
        console.log('inicio da replicacao: '+ new Date().toUTCString());
      });

    },
    sync_db: function (local, remote){
        return new Promise((resolve, reject) => {

          local.replicate.from(remote)
            .on('complete', function (info) {app.received_db('deviceready');console.log('teste ok');})
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

app.initialize();
