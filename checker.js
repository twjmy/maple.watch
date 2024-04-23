/* Copyright 2015, All Rights Reserved. */
var checkTimeout = 1500,
    checkDelay = 100,
    showIPPort = true,
    showConnection = true,
    clickToRefresh = false,
    fixPing = true,
    selected = "Main",
    subSelection = "",
    processing = 0,
    hash = window.location.hash.split('-'),
    alreadyProcessed = [],
    rendered = 0,
    loadingTimers = [],
    loadingArr = [{
        loading: true,
        unknown: true
    }],
    clockTicking = false;

if (hash.length) {
    switch (hash[0]) {
        case "#EMS":
        case "#GMS":
        case "#JMS":
        case "#KMS":
        case "#CMS":
        case "#MSEA":
		case "#TMS":
            selected = hash[0].replace('#', '');
            break;
        default:
            break;
    }
}

if (hash.length > 1) {
    subSelection = hash[1];
} else {
    subSelection = GetDefaultSubSelectionForVersion(selected);
}

function ping(ip, callback) {
    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        this.start = 0;
        var _that = this;
        this.img = new Image();
        this.img.onload = function(e) {
            window.clearInterval(_that.timer);
            _that.inUse = false;
            _that.callback('responded', +(new Date()) - _that.start);
            if (--processing == 0)
                if (window.stop) {
                    window.stop();
                } else if (document.execCommand) {
                document.execCommand('Stop');
            };
        };
        this.img.onerror = function(e, error, errorThrown) {
            if (_that.inUse) {
                window.clearInterval(_that.timer);
                _that.inUse = false;
                _that.callback('responded', +(new Date()) - _that.start, e);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                    document.execCommand('Stop');
                };
                return true;
            }
        };
        this.start = +(new Date());
        this.img.src = "http://" + ip + "/?cachebreaker=" + (+(new Date()));
        this.timer = setTimeout(function() {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout', false);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                    document.execCommand('Stop');
                };
            }
        }, GetCheckTimeout());
    }
}

var PingModel = function(servers) {
    var addr = servers[0].address;

    // Hacky, for some reason the foreach binding fires twice.
    if (!(servers[0].name == 'Self') && alreadyProcessed.indexOf(addr) == -1) {
        alreadyProcessed.push(servers[0].address);
        return;
    }

    var serversArr = [];

    var x = servers;

    for (var i = 0; i < servers.length; i++)
        for (var j = 0; j < servers[i].length; j++)
            serversArr.push(servers[i][j]);

    var self = this;
    var myServers = [];
    var offset = 1;
    ko.utils.arrayForEach(serversArr, function(server) {
        if (!server.isMapleStoryGameServer || server.rel == subSelection || (server.rel == "Login" && (selected != 'GMS' && selected != 'MSEA'))) {
            myServers.push({
                icon: server.icon,
                name: server.name,
                sub: server.sub || false,
                interval: server.interval || false,
                address: server.address,
                port: server.port,
                unknown: server.unknown || false,
                status: ko.observable('unchecked'),
                time: ko.observable(""),
                values: ko.observableArray(),
                rel: server.rel
            });
        }
    });

    self.servers = ko.observableArray(myServers);
    processing += self.servers().length;
    ko.utils.arrayForEach(self.servers(), function(s) {
        s.status('checking');

        function doPing() {
            new ping(s.address + ":" + s.port, function(status, time, e) {
                s.status(status);
                s.time(time);
                s.values.push(time);
                if (s.name == "Self") {
                    SetPingOffset(time);
                }
                console.clear();
                /*if (s.interval) {
                	setTimeout(doPing, s.interval);
                }*/
            });
        }
        setTimeout(function() {
            doPing();
        }, checkDelay * offset++)
    });
};

var GameServer = function(version, timeOffset, icons, servers) {
    return {
        name: "遊戲伺服器",
        description: "這是楓之谷 " + version + " 伺服器列表",
        selectedServers: ko.observable(loadingArr),
        icons: icons,
        timeOffset: timeOffset,
        content: function() {
            return new PingModel(servers)
        }
    }
}

var servers = {
    EMS: {
        Login: [{
            icon: "Mushroom_16.png",
            name: "Login",
            address: "18.196.14.103", // Verified as of 2020-06-10
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        Luna: [{
                icon: "Luna.png",
                name: "Channel 1",
                address: "109.234.74.70",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            },
            {
                icon: "Luna.png",
                name: "Channel 2",
                address: "109.234.74.71",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 3",
                address: "109.234.74.72",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 4",
                address: "109.234.74.73",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 5",
                address: "109.234.74.73",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 6",
                address: "109.234.74.73",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 7",
                address: "109.234.74.74",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 8",
                address: "109.234.74.74",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 9",
                address: "109.234.74.74",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 10",
                address: "109.234.74.75",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 11",
                address: "109.234.74.75",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 12",
                address: "109.234.74.75",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 13",
                address: "109.234.74.76",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 14",
                address: "109.234.74.76",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 15",
                address: "109.234.74.76",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 16",
                address: "109.234.74.77",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 17",
                address: "109.234.74.77",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 18",
                address: "109.234.74.77",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 19",
                address: "109.234.74.78",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 20",
                address: "109.234.74.78",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }
        ],
        Reboot: [{
                icon: "Reboot.png",
                name: "Channel 1",
                address: "8.31.99.161",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 2",
                address: "8.31.99.135",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 3",
                address: "8.31.99.237",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 4",
                address: "8.31.99.136",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 5",
                address: "8.31.99.162",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 6",
                address: "8.31.99.137",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 7",
                address: "8.31.99.195",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 8",
                address: "8.31.99.138",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 9",
                address: "8.31.99.163",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 10",
                address: "8.31.99.144",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 11",
                address: "8.31.99.196",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 12",
                address: "8.31.99.145",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 13",
                address: "8.31.99.157",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 14",
                address: "8.31.99.146",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 15",
                address: "8.31.99.197",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 16",
                address: "8.31.99.158",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 17",
                address: "8.31.99.147",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 18",
                address: "8.31.99.148",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 19",
                address: "8.31.99.150",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 20",
                address: "8.31.99.149",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Cash Shop",
                address: "8.31.99.192",
                port: "8786",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ],
        InternalWebsites: [{
                icon: "Mushroom_16.png",
                name: "MapleStory",
                sub: "",
                address: "maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Forum",
                sub: "",
                address: "forum2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Support",
                sub: "",
                address: "support.maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Download",
                sub: "",
                address: "download2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Press",
                sub: "",
                address: "press.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Avatars",
                sub: "NXA",
                address: "msavatar1.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Images",
                sub: "NXA",
                address: "nxcache.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "API",
                sub: "NXA",
                address: "api.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Guard",
                sub: "NXA",
                address: "guard.nexon.net",
                port: "80",
                rel: "nexon.net"
            }
        ],
        ExternalWebsites: [{
                icon: "fa-external-link",
                name: "Google",
                sub: "",
                address: "google.com",
                port: "80",
                interval: 60000,
                rel: "google.com"
            }
        ]
    },
    GMS: {
        Login: [{
                icon: "Mushroom_16.png",
                name: "Login 1",
                address: "34.215.62.60", // Verified as of 
                port: "8484",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom_16.png",
                name: "Login 2",
                address: "35.167.153.201", // Verified as of 
                port: "8484",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom_16.png",
                name: "Login 3",
                address: "52.37.193.138", // Verified as of 2020-06-10
                port: "8484",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        CrossWorld: [{
            icon: "Generic.png",
            name: "Cross World",
            address: "54.149.241.32",
            port: "8586",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        Scania: [{
                icon: "Scania.png",
                name: "Channel 1",
                address: "35.163.4.248", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 2",
                address: "54.69.121.239", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 3",
                address: "52.27.135.94", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 4",
                address: "34.218.55.122", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 5",
                address: "54.213.105.170", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 6",
                address: "52.37.131.173", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 7",
                address: "52.38.110.221", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 8",
                address: "50.112.158.189", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 9",
                address: "34.215.85.101", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 10",
                address: "54.191.76.216", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 11",
                address: "54.191.254.95", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 12",
                address: "50.112.211.236", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 13",
                address: "35.165.21.160", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 14",
                address: "34.211.249.74", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 15",
                address: "52.43.74.100", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 16",
                address: "34.209.206.177", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 17",
                address: "34.214.52.19", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 18",
                address: "54.189.248.141", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 19",
                address: "34.208.240.38", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 20",
                address: "54.245.14.209", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Cash Shop",
                address: "52.32.42.163", // Verified as of 
                port: "8785",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Monster Life",
                address: "34.217.198.173", // verified as of
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Auction House",
                address: "34.209.161.140", // Verified as of 
                port: "8785",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            }
        ],
        Bera: [{
                icon: "Bera.png",
                name: "Channel 1",
                address: "54.186.151.49", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 2",
                address: "54.214.207.253", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 3",
                address: "34.214.214.251", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 4",
                address: "35.165.105.161", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 5",
                address: "35.167.16.143", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 6",
                address: "52.40.39.138", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 7",
                address: "54.68.47.217", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 8",
                address: "52.35.241.179", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 9",
                address: "34.218.68.31", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 10",
                address: "52.43.9.29", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 11",
                address: "54.213.64.154", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 12",
                address: "52.25.121.0", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 13",
                address: "54.148.5.57", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 14",
                address: "35.161.154.148", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 15",
                address: "54.203.140.45", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 16",
                address: "35.163.184.1", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 17",
                address: "34.218.100.191", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 18",
                address: "52.38.89.169", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 19",
                address: "52.88.17.178", // Verified as of 2020-06-10
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 20", // Verified as of 2020-06-10
                address: "52.27.189.124",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 1", // Verified as of 2020-06-10
                address: "54.70.148.148",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 2",
                address: "54.70.148.148", // 50.112.51.145 previously, verified as of 2020-06-10
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 3",
                address: "54.70.148.148", // 35.164.186.245 previously, verified as of 2020-06-10
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Cash Shop",
                address: "54.203.24.179", // Verified as of 2020-06-10
                port: "8786",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Monster Life", // Verified as of 2020-06-10
                address: "34.217.198.173",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Auction House", // Verified as of 2020-06-10
                address: "34.209.161.140",
                port: "8786",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            }
        ],
        Elysium: [{
                icon: "Elysium.png",
                name: "Channel 1",
                address: "54.214.132.190", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 2",
                address: "54.245.208.58", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 3",
                address: "35.165.10.219", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 4",
                address: "54.214.75.83", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 5",
                address: "35.163.91.77", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 6",
                address: "35.166.234.61", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 7",
                address: "52.43.231.158", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 8",
                address: "52.35.100.28", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 9",
                address: "54.70.100.207", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 10",
                address: "35.163.79.48", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 11",
                address: "52.32.142.22", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 12",
                address: "54.186.3.5", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 13",
                address: "34.211.210.222", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 14",
                address: "35.166.32.116", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 15",
                address: "54.186.75.108", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 16",
                address: "52.37.9.209", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 17",
                address: "52.37.174.51", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 18",
                address: "52.32.10.100", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 19",
                address: "54.203.45.149", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 20",
                address: "52.41.244.230", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Cash Shop",
                address: "52.10.224.51", // Verified as of 
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Monster Life",
                address: "52.42.29.253", // Verified as of
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8790",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            }
        ],
		Aurora: [{
                icon: "Aurora.png",
                name: "Channel 1",
                address: "52.26.44.15", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 2",
                address: "52.88.199.249", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 3",
                address: "54.71.159.23", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 4",
                address: "54.200.197.85", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 5",
                address: "52.24.108.169", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 6",
                address: "52.32.48.160", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 7",
                address: "52.27.243.250", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 8",
                address: "54.203.90.46", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 9",
                address: "54.148.240.123", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 10",
                address: "35.164.217.126", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 11",
                address: "52.36.214.18", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 12",
                address: "35.162.50.9", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 13",
                address: "52.40.100.64", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 14",
                address: "52.39.159.3", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 15",
                address: "34.216.36.199", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 16",
                address: "34.213.140.179", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 17",
                address: "54.203.178.92", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 18",
                address: "54.214.75.143", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 19",
                address: "52.24.61.30", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 20",
                address: "34.208.168.106", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Cash Shop",
                address: "52.10.224.51", // Verified as of 
                port: "8786",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Monster Life",
                address: "52.42.29.253", // Verified as of
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8789",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            }
        ],
        Reboot: [{
				icon: "Reboot.png",
				name: "Channel 1",
				address: "35.155.204.207",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 2",
				address: "52.26.82.74",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 3",
				address: "34.217.205.66",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 4",
				address: "35.161.183.101",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 5",
				address: "54.218.157.183",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 6",
				address: "52.25.78.39",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 7",
				address: "54.68.160.34",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 8",
				address: "34.218.141.142",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 9",
				address: "52.33.249.126",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 10",
				address: "54.148.170.23",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 11",
				address: "54.201.184.26",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 12",
				address: "54.191.142.56",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 13",
				address: "52.13.185.207",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 14",
				address: "34.215.228.37",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 15",
				address: "54.187.177.143",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 16",
				address: "54.203.83.148",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 17",
				address: "54.148.188.235",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 18",
				address: "52.43.83.76",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 19",
				address: "54.69.114.137",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 20",
				address: "54.148.137.49",
				port: 8585,
				interval: 1500,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
            {
                icon: "Reboot.png",
                name: "Channel 21", // Verified as of 
                address: "54.212.109.33",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 22", // Verified as of 
                address: "44.230.255.51",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 23", // Verified as of 
                address: "100.20.116.83",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 24", // Verified as of 
                address: "54.188.84.22",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 25", // Verified as of 
                address: "34.215.170.50",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 26", // Verified as of 
                address: "54.184.162.28",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 27", // Verified as of 
                address: "54.185.209.29",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 28", // Verified as of 
                address: "52.12.53.225",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 29", // Verified as of 
                address: "54.189.33.238",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 30", // Verified as of 
                address: "54.188.84.238",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 1",
				address: "52.10.175.83",
		        port: "8585",
		        interval: 1500,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 2",
				address: "52.10.175.83",
		        port: "8586",
		        interval: 1500,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 3",
				address: "52.10.175.83",
		        port: "8587",
		        interval: 1500,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
            {
                icon: "Reboot.png",
                name: "Cash Shop",
                address: "52.32.42.163",
                port: "8788",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ],
		Burning: [{
                icon: "Burning.png",
                name: "Channel 1",
                address: "52.26.44.15", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 2",
                address: "52.88.199.249", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 3",
                address: "54.71.159.23", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 4",
                address: "54.200.197.85", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 5",
                address: "52.24.108.169", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 6",
                address: "52.32.48.160", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 7",
                address: "52.27.243.250", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 8",
                address: "54.203.90.46", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 9",
                address: "54.148.240.123", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 10",
                address: "35.164.217.126", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 11",
                address: "52.36.214.18", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 12",
                address: "35.162.50.9", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 13",
                address: "52.40.100.64", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 14",
                address: "52.39.159.3", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 15",
                address: "34.216.36.199", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 16",
                address: "34.213.140.179", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 17",
                address: "54.203.178.92", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 18",
                address: "54.214.75.143", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 19",
                address: "52.24.61.30", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 20",
                address: "34.208.168.106", // Verified as of 
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Cash Shop",
                address: "52.10.224.51", // Verified as of 
                port: "8786",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Monster Life",
                address: "52.42.29.253", // Verified as of
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8789",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            }
        ],
        Websites: [{
                icon: "Mushroom_16.png",
                name: "MapleStory",
                sub: "",
                address: "maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Forum",
                sub: "",
                address: "forums.maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Support",
                sub: "",
                address: "support-maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Download",
                sub: "",
                address: "download2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Avatars",
                sub: "NXA",
                address: "msavatar1.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Images",
                sub: "NXA",
                address: "nxcache.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Guard",
                sub: "NXA",
                address: "guard.nexon.net",
                port: "80",
                rel: "nexon.net"
            }
        ]
    },
    JMS: {
        Login: [{
            icon: "Mushroom_16.png",
            name: "Login",
            address: "202.80.104.27",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        'かえで': [{
            icon: "Kaede.png",
            english: "Kaede",
            name: "Channel 1",
            address: "175.207.0.70",
            port: "8585",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "かえで"
        },
        {
            icon: "Kaede.png",
            english: "Kaede",
            name: "Ch. 20세이상",
            address: "175.207.0.70",
            port: "8586",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "かえで"
        }
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        'くるみ': [{
                icon: "Kurumi.png",
                english: "Kurumi",
                name: "Channel 1",
                address: "175.207.0.70",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "くるみ"
            },
            {
                icon: "Kurumi.png",
                english: "Kurumi",
                name: "Ch. 20세이상",
                address: "175.207.0.70",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "くるみ"
            }
        ],
        'ゆかり': [{
                icon: "Yukari.png",
                english: "Yukari",
                name: "Channel 1",
                address: "175.207.0.80",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ゆかり"
            },
            {
                icon: "Yukari.png",
                english: "Yukari",
                name: "Ch. 20세이상",
                address: "175.207.0.80",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ゆかり"
            }
        ],
        'リブート': [{
            icon: "Reboot.png",
            english: "Reboot",
            name: "Channel 1",
            address: "175.207.0.80",
            port: "8585",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "リブート"
        },
        {
            icon: "Reboot.png",
            english: "Reboot",
            name: "Ch. 20세이상",
            address: "175.207.0.80",
            port: "8586",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "リブート"
        }
        ]
    },
    KMS: {
        Login: [{
            icon: "Mushroom_16.png",
            name: "Login",
            address: "175.207.0.34",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        '스카니아': [{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 1",
                address: "175.207.0.65",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Ch. 20세이상",
                address: "175.207.0.65",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 2",
                address: "175.207.0.240",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 3",
                address: "175.207.0.240",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 4",
                address: "175.207.0.241",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 5",
                address: "175.207.0.66",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 6",
                address: "175.207.0.66",
                port: "8588",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 7",
                address: "175.207.0.243",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 8",
                address: "175.207.0.67",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 9",
                address: "175.207.0.67",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 10",
                address: "175.207.0.67",
                port: "8588",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 11",
                address: "175.207.0.68",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 12",
                address: "175.207.0.68",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 13",
                address: "175.207.0.68",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 14",
                address: "175.207.0.243",
                port: "8588",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 15",
                address: "175.207.0.241",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 16",
                address: "175.207.0.250",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 17",
                address: "175.207.0.242",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 18",
                address: "175.207.0.242",
                port: "8588",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 19",
                address: "175.207.0.69",
                port: "8589",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Cash Shop",
                address: "175.207.0.10",
                port: "8780",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            }
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        '베라': [{
                icon: "Bera.png",
                english: "Bera",
                name: "Channel 1",
                address: "175.207.0.70",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "베라"
            },
            {
                icon: "Bera.png",
                english: "Bera",
                name: "Ch. 20세이상",
                address: "175.207.0.70",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "베라"
            }
        ],
        '루나': [{
                icon: "Luna.png",
                english: "Luna",
                name: "Channel 1",
                address: "175.207.0.80",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "루나"
            },
            {
                icon: "Luna.png",
                english: "Luna",
                name: "Ch. 20세이상",
                address: "175.207.0.80",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "루나"
            }
        ],
        '제니스': [{
                icon: "Zenith.png",
                english: "Zenith",
                name: "Channel 1",
                address: "175.207.0.85",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "제니스"
            },
            {
                icon: "Zenith.png",
                english: "Zenith",
                name: "Ch. 20세이상",
                address: "175.207.0.85",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "제니스"
            }
        ],
        '크로아': [{
                icon: "Croa.png",
                english: "Croa",
                name: "Channel 1",
                address: "175.207.0.90",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "크로아"
            },
            {
                icon: "Croa.png",
                english: "Croa",
                name: "Ch. 20세이상",
                address: "175.207.0.90",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "크로아"
            }
        ],
        '유니온': [{
                icon: "Union.png",
                english: "Union",
                name: "Channel 1",
                address: "175.207.0.246",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "유니온"
            },
            {
                icon: "Union.png",
                english: "Union",
                name: "Ch. 20세이상",
                address: "175.207.0.115",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "유니온"
            }
        ],
        '엘리시움': [{
                icon: "Elysium.png",
                english: "Elysium",
                name: "Channel 1",
                address: "175.207.0.140",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "엘리시움"
            },
            {
                icon: "Elysium.png",
                english: "Elysium",
                name: "Ch. 20세이상",
                address: "175.207.0.140",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "엘리시움"
            }
        ],
        '이노시스': [{
                icon: "Enosis.png",
                english: "Enosis",
                name: "Channel 1",
                address: "175.207.0.165",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "이노시스"
            },
            {
                icon: "Enosis.png",
                english: "Enosis",
                name: "Ch. 20세이상",
                address: "175.207.0.165",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "이노시스"
            }
        ],
        '레드': [{
                icon: "Red.png",
                english: "Red",
                name: "Channel 1",
                address: "175.207.0.235",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "레드"
            },
            {
                icon: "Red.png",
                english: "Red",
                name: "Ch. 20세이상",
                address: "175.207.0.235",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "레드"
            }
        ],
        '오로라': [{
                icon: "Aurora.png",
                english: "Aurora",
                name: "Channel 1",
                address: "175.207.0.230",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "오로라"
            },
            {
                icon: "Aurora.png",
                english: "Aurora",
                name: "Ch. 20세이상",
                address: "175.207.0.230",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "오로라"
            }
        ],
        '아케인': [{
            icon: "Arcane.png",
            english: "Arcane",
            name: "Channel 1",
            address: "175.207.0.230",
            port: "8585",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "아케인"
        },
        {
            icon: "Arcane.png",
            english: "Arcane",
            name: "Ch. 20세이상",
            address: "175.207.0.230",
            port: "8586",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "아케인"
        }
    ],
    '노바': [{
        icon: "Nova.png",
        english: "Nova",
        name: "Channel 1",
        address: "175.207.0.230",
        port: "8585",
        interval: 1500,
        values: [],
        isMapleStoryGameServer: true,
        rel: "노바"
    },
    {
        icon: "Nova.png",
        english: "Nova",
        name: "Ch. 20세이상",
        address: "175.207.0.230",
        port: "8586",
        interval: 1500,
        values: [],
        isMapleStoryGameServer: true,
        rel: "노바"
    }
],
'리부트': [{
    icon: "Reboot.png",
    english: "Reboot",
    name: "Channel 1",
    address: "175.207.0.230",
    port: "8585",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트"
},
{
    icon: "Reboot.png",
    english: "Reboot",
    name: "Ch. 20세이상",
    address: "175.207.0.230",
    port: "8586",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트"
}
],
'리부트2': [{
    icon: "Reboot.png",
    english: "Reboot2",
    name: "Channel 1",
    address: "175.207.0.230",
    port: "8585",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트2"
},
{
    icon: "Reboot.png",
    english: "Reboot2",
    name: "Ch. 20세이상",
    address: "175.207.0.230",
    port: "8586",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트2"
}
],
'테스트월드1': [{
    icon: "TestWorld.png",
    english: "TestWorld1",
    name: "Channel 1",
    address: "175.207.0.230",
    port: "8585",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "테스트월드1"
},
{
    icon: "TestWorld.png",
    english: "TestWorld1",
    name: "Ch. 20세이상",
    address: "175.207.0.230",
    port: "8586",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "테스트월드1"
}
],
'테스트월드2': [{
    icon: "TestWorld.png",
    english: "TestWorld2",
    name: "Channel 1",
    address: "175.207.0.230",
    port: "8585",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "테스트월드2"
},
{
    icon: "TestWorld.png",
    english: "TestWorld2",
    name: "Ch. 20세이상",
    address: "175.207.0.230",
    port: "8586",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "테스트월드2"
}
],
'리부트T': [{
    icon: "Reboot.png",
    english: "RebootT",
    name: "Channel 1",
    address: "175.207.0.230",
    port: "8585",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트T"
},
{
    icon: "Reboot.png",
    english: "RebootT",
    name: "Ch. 20세이상",
    address: "175.207.0.230",
    port: "8586",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트T"
}
],
'리부트T2': [{
    icon: "Reboot.png",
    english: "RebootT2",
    name: "Channel 1",
    address: "175.207.0.230",
    port: "8585",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트T2"
},
{
    icon: "Reboot.png",
    english: "RebootT2",
    name: "Ch. 20세이상",
    address: "175.207.0.230",
    port: "8586",
    interval: 1500,
    values: [],
    isMapleStoryGameServer: true,
    rel: "리부트T2"
}
]
    },
    CMS: {
        Login: [{
            icon: "Mushroom_16.png",
            english: "Gateway of Wind",
            name: "风之大陆",
            address: "159.75.223.31",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            english: "Gateway of Light",
            name: "光之大陆",
            address: "109.244.2.229",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            english: "Gateway of Clouds",
            name: "云之大陆",
            address: "109.244.2.214",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            english: "Gateway of Darkness",
            name: "暗之大陆",
            address: "109.244.2.219",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            english: "Gateway of Water",
            name: "水之大陆",
            address: "159.75.223.108",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            english: "Tespia",
            name: "测试区",
            address: "116.211.24.140",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
            '路西德': [
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 1",
                    address: "159.75.223.83",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 2",
                    address: "159.75.223.84",
                    port: "8586",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 3 贵宾",
                    address: "159.75.223.85",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 4 贵宾",
                    address: "159.75.223.86",
                    port: "8586",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 5",
                    address: "159.75.223.87",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 6",
                    address: "159.75.223.88",
                    port: "8586",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 7",
                    address: "159.75.223.89",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 8",
                    address: "159.75.223.90",
                    port: "8586",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 9",
                    address: "159.75.223.91",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 10",
                    address: "159.75.223.92",
                    port: "8586",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 11",
                    address: "159.75.223.93",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 12",
                    address: "159.75.223.94",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 13",
                    address: "159.75.223.95",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 14",
                    address: "159.75.223.96",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 15",
                    address: "159.75.223.97",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 16",
                    address: "159.75.223.98",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 17",
                    address: "159.75.223.99",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 18",
                    address: "159.75.223.100",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 19",
                    address: "159.75.223.101",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "频道 20",
                    address: "159.75.223.102",
                    port: "8585",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "商城",
                    address: "159.75.223.37",
                    port: "8700",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                },
                {
                    icon: "Lucid.png",
                    english: "Lucid",
                    name: "拍卖场",
                    address: "159.75.223.23",
                    port: "8795",
                    interval: 1500,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel:  "路西德"
                }
            ],
                '威尔': [
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 1",
                        address: "159.75.223.62",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 2",
                        address: "159.75.223.63",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 3 贵宾",
                        address: "159.75.223.64",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 4 贵宾",
                        address: "159.75.223.65",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 5",
                        address: "159.75.223.66",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 6",
                        address: "159.75.223.67",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 7",
                        address: "159.75.223.68",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 8",
                        address: "159.75.223.69",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 9",
                        address: "159.75.223.70",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 10",
                        address: "159.75.223.71",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 11",
                        address: "159.75.223.72",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 12",
                        address: "159.75.223.73",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 13",
                        address: "159.75.223.74",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 14",
                        address: "159.75.223.75",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 15",
                        address: "159.75.223.76",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 16",
                        address: "159.75.223.77",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 17",
                        address: "159.75.223.78",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 18",
                        address: "159.75.223.79",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 19",
                        address: "159.75.223.80",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "频道 20",
                        address: "159.75.223.81",
                        port: "8585",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "商城",
                        address: "159.75.223.38",
                        port: "8701",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    },
                    {
                        icon: "Will.png",
                        english: "Will",
                        name: "拍卖场",
                        address: "159.75.223.23",
                        port: "8796",
                        interval: 1500,
                        values: [],
                        isMapleStoryGameServer: true,
                        rel: "威尔"
                    }
                ],
                    '奥尔卡': [
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 1",
                            address: "159.75.223.41",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 2",
                            address: "159.75.223.42",
                            port: "8586",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 3 贵宾",
                            address: "159.75.223.43",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 4 贵宾",
                            address: "159.75.223.44",
                            port: "8586",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 5",
                            address: "159.75.223.45",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 6",
                            address: "159.75.223.46",
                            port: "8586",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 7",
                            address: "159.75.223.47",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 8",
                            address: "159.75.223.48",
                            port: "8586",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 9",
                            address: "159.75.223.49",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 10",
                            address: "159.75.223.50",
                            port: "8586",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 11",
                            address: "159.75.223.51",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 12",
                            address: "159.75.223.52",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 13",
                            address: "159.75.223.53",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 14",
                            address: "159.75.223.54",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 15",
                            address: "159.75.223.55",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 16",
                            address: "159.75.223.56",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 17",
                            address: "159.75.223.57",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 18",
                            address: "159.75.223.58",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 19",
                            address: "159.75.223.59",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "频道 20",
                            address: "159.75.223.60",
                            port: "8585",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "商城",
                            address: "159.75.223.39",
                            port: "8702",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        },
                        {
                            icon: "Orchid_CN.png",
                            english: "Orchid",
                            name: "拍卖场",
                            address: "159.75.223.23",
                            port: "8797",
                            interval: 1500,
                            values: [],
                            isMapleStoryGameServer: true,
                            rel: "奥尔卡"
                        }
                    ],
                        '戴米安': [
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 1",
                                address: "109.244.2.233",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 2",
                                address: "109.244.2.234",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 3 贵宾",
                                address: "109.244.2.235",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 4 贵宾",
                                address: "109.244.2.236",
                                port: "8586",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 5",
                                address: "109.244.2.237",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 6",
                                address: "109.244.2.238",
                                port: "8586",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 7",
                                address: "109.244.2.239",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 8",
                                address: "109.244.2.240",
                                port: "8586",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 9",
                                address: "109.244.2.241",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 10",
                                address: "109.244.2.242",
                                port: "8586",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 11",
                                address: "109.244.2.243",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 12",
                                address: "109.244.2.244",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 13",
                                address: "109.244.2.245",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 14",
                                address: "109.244.2.246",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 15",
                                address: "109.244.2.247",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 16",
                                address: "109.244.2.248",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 17",
                                address: "109.244.2.249",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 18",
                                address: "109.244.2.250",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 19",
                                address: "109.244.2.251",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "频道 20",
                                address: "109.244.2.252",
                                port: "8585",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "商城",
                                address: "109.244.2.232",
                                port: "8730",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            },
                            {
                                icon: "Damien.png",
                                english: "Damien",
                                name: "拍卖场",
                                address: "109.244.2.159",
                                port: "8795",
                                interval: 1500,
                                values: [],
                                isMapleStoryGameServer: true,
                                rel: "戴米安"
                            }
                        ],
                            '希拉': [
                                {
                                    icon: "Hilla.png",
                                    name: "频道 1",
                                    address: "109.244.2.187",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 2",
                                    address: "109.244.2.193",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 3 贵宾",
                                    address: "109.244.2.188",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 4 贵宾",
                                    address: "109.244.2.188",
                                    port: "8586",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 5",
                                    address: "109.244.2.189",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 6",
                                    address: "109.244.2.194",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 7",
                                    address: "109.244.2.190",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 8",
                                    address: "109.244.2.190",
                                    port: "8586",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 9",
                                    address: "109.244.2.191",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 10",
                                    address: "109.244.2.191",
                                    port: "8586",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 11",
                                    address: "109.244.2.192",
                                    port: "8585",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "频道 12",
                                    address: "109.244.2.192",
                                    port: "8586",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "商城",
                                    address: "109.244.2.208",
                                    port: "8760",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                },
                                {
                                    icon: "Hilla.png",
                                    name: "拍卖场",
                                    address: "109.244.2.206",
                                    port: "8795",
                                    interval: 1500,
                                    values: [],
                                    isMapleStoryGameServer: true,
                                    rel: "希拉"
                                }
                            ],
                                '班·雷昂': [
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 1",
                                        address: "109.244.2.198",
                                        port: "8585",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 2",
                                        address: "109.244.2.198",
                                        port: "8586",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 3",
                                        address: "109.244.2.199",
                                        port: "8585",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 4",
                                        address: "109.244.2.199",
                                        port: "8586",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 5",
                                        address: "109.244.2.200",
                                        port: "8585",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 6",
                                        address: "109.244.2.200",
                                        port: "8586",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 7",
                                        address: "109.244.2.201",
                                        port: "8585",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 8",
                                        address: "109.244.2.201",
                                        port: "8586",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 9",
                                        address: "109.244.2.202",
                                        port: "8585",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "频道 10",
                                        address: "109.244.2.202",
                                        port: "8586",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "商城",
                                        address: "109.244.2.209",
                                        port: "8790",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    },
                                    {
                                        icon: "VonLeon.png",
                                        english: "VonLeon",
                                        name: "拍卖场",
                                        address: "109.244.2.207",
                                        port: "8795",
                                        interval: 1500,
                                        values: [],
                                        isMapleStoryGameServer: true,
                                        rel: "班·雷昂"
                                    }
                                ],
                                    '麦格纳斯': [
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 1",
                                            address: "159.75.223.22",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 2",
                                            address: "159.75.223.115",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 3 贵宾",
                                            address: "159.75.223.116",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 4 贵宾",
                                            address: "159.75.223.117",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 5",
                                            address: "159.75.223.118",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 6",
                                            address: "159.75.223.119",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 7",
                                            address: "159.75.223.120",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 8",
                                            address: "159.75.223.121",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 9",
                                            address: "159.75.223.122",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 10",
                                            address: "159.75.223.123",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 11",
                                            address: "159.75.223.124",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "频道 12",
                                            address: "159.75.223.125",
                                            port: "8585",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "商城",
                                            address: "159.75.223.113",
                                            port: "7120",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        },
                                        {
                                            icon: "Magnus.png",
                                            english: "Magnus",
                                            name: "拍卖场",
                                            address: "159.75.223.103",
                                            port: "8795",
                                            interval: 1500,
                                            values: [],
                                            isMapleStoryGameServer: true,
                                            rel: "麦格纳斯"
                                        }
                                    ],
                                        '测试区': [
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 1",
                                                address: "116.211.24.51",
                                                port: "8584",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 2",
                                                address: "116.211.24.51",
                                                port: "8585",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 3",
                                                address: "116.211.24.110",
                                                port: "8584",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 4",
                                                address: "116.211.24.110",
                                                port: "8585",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 5",
                                                address: "116.211.24.134",
                                                port: "8584",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 6",
                                                address: "116.211.24.134",
                                                port: "8585",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 7",
                                                address: "116.211.24.135",
                                                port: "8584",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 8",
                                                address: "116.211.24.135",
                                                port: "8585",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 9",
                                                address: "116.211.24.136",
                                                port: "8584",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "频道 10",
                                                address: "116.211.24.136",
                                                port: "8585",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "商城",
                                                address: "116.211.24.140",
                                                port: "8700",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            },
                                            {
                                                icon: "TestWorld.png",
                                                english: "TestWorld",
                                                name: "拍卖场",
                                                address: "116.211.11.211",
                                                port: "8795",
                                                interval: 1500,
                                                values: [],
                                                isMapleStoryGameServer: true,
                                                rel: "测试区"
                                            }
                                        ]
    },
    MSEA: {
        Login: [{
                icon: "Mushroom_16.png",
                name: "Login 1",
                address: "121.52.202.7",
                port: "8484",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom_16.png",
                name: "Login 2",
                address: "121.52.202.9",
                port: "8484",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Generic.png",
                name: "Merge World",
                address: "121.52.202.81",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        Aquila: [{
                icon: "Aquila.png",
                name: "Channel 1",
                address: "121.52.202.15",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 2",
                address: "121.52.202.16",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 3",
                address: "121.52.202.17",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 4",
                address: "121.52.202.18",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 5",
                address: "121.52.202.18",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 6",
                address: "121.52.202.18",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 7",
                address: "121.52.202.19",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 8",
                address: "121.52.202.19",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 9",
                address: "121.52.202.19",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 10",
                address: "121.52.202.20",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 11",
                address: "121.52.202.20",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 12",
                address: "121.52.202.20",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 13",
                address: "121.52.202.21",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 14",
                address: "121.52.202.21",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 15",
                address: "121.52.202.21",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 16",
                address: "121.52.202.22",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 17",
                address: "121.52.202.22",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 18",
                address: "121.52.202.22",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 19",
                address: "121.52.202.23",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 20",
                address: "121.52.202.23",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 21",
                address: "121.52.202.23",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 22",
                address: "121.52.202.24",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 23",
                address: "121.52.202.24",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 24",
                address: "121.52.202.24",
                port: "8587",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 25",
                address: "121.52.202.25",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 26",
                address: "121.52.202.26",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 27",
                address: "121.52.202.27",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 28",
                address: "121.52.202.28",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 29",
                address: "121.52.202.29",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 30",
                address: "121.52.202.30",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Cash Shop",
                address: "121.52.202.11",
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Auction",
                address: "121.52.202.85",
                port: "9000",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            }
        ],
        Bootes: [{
                icon: "Bootes.png",
                name: "Channel 1",
                address: "121.52.202.35",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 2",
                address: "121.52.202.35",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 3",
                address: "121.52.202.36",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 4",
                address: "121.52.202.36",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 5",
                address: "121.52.202.37",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 6",
                address: "121.52.202.37",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 7",
                address: "121.52.202.38",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 8",
                address: "121.52.202.38",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 9",
                address: "121.52.202.39",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 10",
                address: "121.52.202.39",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 11",
                address: "121.52.202.40",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 12",
                address: "121.52.202.40",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 13",
                address: "121.52.202.41",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 14",
                address: "121.52.202.41",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 15",
                address: "121.52.202.42",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 16",
                address: "121.52.202.42",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 17",
                address: "121.52.202.43",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 18",
                address: "121.52.202.43",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 19",
                address: "121.52.202.44",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 20",
                address: "121.52.202.44",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 21",
                address: "121.52.202.45",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 22",
                address: "121.52.202.45",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 23",
                address: "121.52.202.46",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 24",
                address: "121.52.202.46",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 25",
                address: "121.52.202.47",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 26",
                address: "121.52.202.47",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 27",
                address: "121.52.202.48",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 28",
                address: "121.52.202.48",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 29",
                address: "121.52.202.49",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 30",
                address: "121.52.202.49",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Cash Shop",
                address: "121.52.202.11",
                port: "8788",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Auction",
                address: "121.52.202.86",
                port: "9000",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            }
        ],
        Cassiopeia: [{
                icon: "Cassiopeia.png",
                name: "Channel 1",
                address: "121.52.202.51",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 2",
                address: "121.52.202.52",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 3",
                address: "121.52.202.53",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 4",
                address: "121.52.202.54",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 5",
                address: "121.52.202.55",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 6",
                address: "121.52.202.56",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 7",
                address: "121.52.202.57",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 8",
                address: "121.52.202.58",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 9",
                address: "121.52.202.59",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 10",
                address: "121.52.202.60",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 11",
                address: "121.52.202.51",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 12",
                address: "121.52.202.52",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 13",
                address: "121.52.202.53",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 14",
                address: "121.52.202.54",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 15",
                address: "121.52.202.55",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 16",
                address: "121.52.202.56",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 17",
                address: "121.52.202.57",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 18",
                address: "121.52.202.58",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 19",
                address: "121.52.202.59",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 20",
                address: "121.52.202.60",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 21",
                address: "121.52.202.91",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 22",
                address: "121.52.202.91",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 23",
                address: "121.52.202.92",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 24",
                address: "121.52.202.92",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 25",
                address: "121.52.202.93",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 26",
                address: "121.52.202.93",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 27",
                address: "121.52.202.94",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 28",
                address: "121.52.202.94",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 29",
                address: "121.52.202.95",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 30",
                address: "121.52.202.95",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8789",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Auction",
                address: "121.52.202.87",
                port: "9000",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            }
        ],
        Draco: [{
                icon: "Draco.png",
                name: "Channel 1",
                address: "121.52.202.61",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 2",
                address: "121.52.202.61",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 3",
                address: "121.52.202.62",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 4",
                address: "121.52.202.62",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 5",
                address: "121.52.202.63",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 6",
                address: "121.52.202.63",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 7",
                address: "121.52.202.64",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 8",
                address: "121.52.202.64",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 9",
                address: "121.52.202.65",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 10",
                address: "121.52.202.65",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 11",
                address: "121.52.202.66",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 12",
                address: "121.52.202.66",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 13",
                address: "121.52.202.67",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 14",
                address: "121.52.202.67",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 15",
                address: "121.52.202.68",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 16",
                address: "121.52.202.68",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 17",
                address: "121.52.202.69",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 18",
                address: "121.52.202.69",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 19",
                address: "121.52.202.70",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 20",
                address: "121.52.202.70",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 21",
                address: "121.52.202.71",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 22",
                address: "121.52.202.71",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 23",
                address: "121.52.202.72",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 24",
                address: "121.52.202.72",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 25",
                address: "121.52.202.73",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 26",
                address: "121.52.202.73",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 27",
                address: "121.52.202.74",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 28",
                address: "121.52.202.74",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 29",
                address: "121.52.202.75",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 30",
                address: "121.52.202.75",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 31",
                address: "121.52.202.76",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 32",
                address: "121.52.202.76",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 33",
                address: "121.52.202.77",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 34",
                address: "121.52.202.77",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 35",
                address: "121.52.202.78",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Channel 36",
                address: "121.52.202.78",
                port: "8586",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8790",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            },
            {
                icon: "Draco.png",
                name: "Auction",
                address: "121.52.202.88",
                port: "9000",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Draco"
            }
        ]
    },
	TMS: {
        Login: [{
            icon: "Mushroom_16.png",
            name: "Login 1",
            address: "202.80.104.24",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            name: "Login 2",
            address: "202.80.104.25",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
{
            icon: "Mushroom_16.png",
            name: "Login 3",
            address: "202.80.104.26",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
{
            icon: "Mushroom_16.png",
            name: "Login 4",
            address: "202.80.104.27",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            name: "Login 5",
            address: "202.80.104.28",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
{
            icon: "Mushroom_16.png",
            name: "Login 6",
            address: "202.80.104.29",
            port: "8484",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            name: "跨伺服器 1",
            address: "202.80.104.59",
            port: "8686",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            name: "跨伺服器 2",
            address: "202.80.104.60",
            port: "8686",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
{
            icon: "Mushroom_16.png",
            name: "跨伺服器 3",
            address: "202.80.104.61",
            port: "8686",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
{
            icon: "Mushroom_16.png",
            name: "跨伺服器 4",
            address: "202.80.104.62",
            port: "8686",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        },
        {
            icon: "Mushroom_16.png",
            name: "跨伺服器 5",
            address: "202.80.104.63",
            port: "8686",
            interval: 1500,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        '艾麗亞': [
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 1",
                address: "202.80.104.64",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 2",
                address: "202.80.104.64",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 3",
                address: "202.80.104.65",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 4",
                address: "202.80.104.65",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 5",
                address: "202.80.104.66",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 6",
                address: "202.80.104.66",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 7",
                address: "202.80.104.67",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 8",
                address: "202.80.104.67",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 9",
                address: "202.80.104.68",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 10",
                address: "202.80.104.68",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 11",
                address: "202.80.104.69",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 12",
                address: "202.80.104.69",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 13",
                address: "202.80.104.70",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 14",
                address: "202.80.104.70",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 15",
                address: "202.80.104.71",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 16",
                address: "202.80.104.71",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 17",
                address: "202.80.104.72",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 18",
                address: "202.80.104.72",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 19",
                address: "202.80.104.73",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 20",
                address: "202.80.104.73",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 21",
                address: "202.80.104.74",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 22",
                address: "202.80.104.74",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 23",
                address: "202.80.104.75",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 24",
                address: "202.80.104.75",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 25",
                address: "202.80.104.76",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 26",
                address: "202.80.104.76",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 27",
                address: "202.80.104.77",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 28",
                address: "202.80.104.77",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 29",
                address: "202.80.104.78",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 30",
                address: "202.80.104.78",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 31",
                address: "202.80.104.154",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 32",
                address: "202.80.104.154",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 33",
                address: "202.80.104.155",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 34",
                address: "202.80.104.155",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 35",
                address: "202.80.104.156",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 36",
                address: "202.80.104.156",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 37",
                address: "202.80.104.157",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 38",
                address: "202.80.104.157",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 39",
                address: "202.80.104.158",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "Ch. 40",
                address: "202.80.104.158",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "購物商城",
                address: "202.80.104.40",
                port: "8686",
                "interval": "5002",
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "拍賣所",
                address: "202.80.104.40",
                port: "8787",
                "interval": "5003",
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            },
            {
                icon: "Aria.png",
                english: "Aria",
                name: "非公開頻道",
                address: "202.80.104.32",
                port: "8686",
                "interval": "5001",
                values: [],
                isMapleStoryGameServer: true,
                rel: "艾麗亞"
            }
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        '普力特': [
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 1",
                address: "202.80.104.79",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 2",
                address: "202.80.104.79",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 3",
                address: "202.80.104.80",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 4",
                address: "202.80.104.80",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 5",
                address: "202.80.104.81",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 6",
                address: "202.80.104.81",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 7",
                address: "202.80.104.82",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 8",
                address: "202.80.104.82",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 9",
                address: "202.80.104.83",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 10",
                address: "202.80.104.83",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 11",
                address: "202.80.104.84",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 12",
                address: "202.80.104.84",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 13",
                address: "202.80.104.85",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 14",
                address: "202.80.104.85",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 15",
                address: "202.80.104.86",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 16",
                address: "202.80.104.86",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 17",
                address: "202.80.104.87",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 18",
                address: "202.80.104.87",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 19",
                address: "202.80.104.88",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 20",
                address: "202.80.104.88",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 21",
                address: "202.80.104.89",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 22",
                address: "202.80.104.89",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 23",
                address: "202.80.104.90",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 24",
                address: "202.80.104.90",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 25",
                address: "202.80.104.91",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 26",
                address: "202.80.104.91",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 27",
                address: "202.80.104.92",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 28",
                address: "202.80.104.92",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 29",
                address: "202.80.104.93",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "Ch. 30",
                address: "202.80.104.93",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "購物商城",
                address: "202.80.104.41",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "拍賣所",
                address: "202.80.104.41",
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            },
            {
                icon: "Freud.png",
                english: "Freud",
                name: "非公開頻道",
                address: "202.80.104.33",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "普力特"
            }
        ],
        '琉德': [
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 1",
                address: "202.80.104.94",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 2",
                address: "202.80.104.94",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 3",
                address: "202.80.104.95",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 4",
                address: "202.80.104.95",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 5",
                address: "202.80.104.96",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 6",
                address: "202.80.104.96",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 7",
                address: "202.80.104.97",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 8",
                address: "202.80.104.97",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 9",
                address: "202.80.104.98",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 10",
                address: "202.80.104.98",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 11",
                address: "202.80.104.99",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 12",
                address: "202.80.104.99",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 13",
                address: "202.80.104.100",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 14",
                address: "202.80.104.100",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 15",
                address: "202.80.104.101",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 16",
                address: "202.80.104.101",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 17",
                address: "202.80.104.102",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 18",
                address: "202.80.104.102",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 19",
                address: "202.80.104.103",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 20",
                address: "202.80.104.103",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 21",
                address: "202.80.104.104",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 22",
                address: "202.80.104.104",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 23",
                address: "202.80.104.105",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 24",
                address: "202.80.104.105",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 25",
                address: "202.80.104.106",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 26",
                address: "202.80.104.106",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 27",
                address: "202.80.104.107",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 28",
                address: "202.80.104.107",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 29",
                address: "202.80.104.108",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "Ch. 30",
                address: "202.80.104.108",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "購物商城",
                address: "202.80.104.42",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "拍賣所",
                address: "202.80.104.42",
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            },
            {
                icon: "Ryude.png",
                english: "Ryude",
                name: "非公開頻道",
                address: "202.80.104.34",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "琉德"
            }
        ],
        '優依娜': [
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 1",
                address: "202.80.104.109",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 2",
                address: "202.80.104.109",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 3",
                address: "202.80.104.110",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 4",
                address: "202.80.104.110",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 5",
                address: "202.80.104.111",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 6",
                address: "202.80.104.111",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 7",
                address: "202.80.104.112",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 8",
                address: "202.80.104.112",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 9",
                address: "202.80.104.113",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 10",
                address: "202.80.104.113",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 11",
                address: "202.80.104.114",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 12",
                address: "202.80.104.114",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 13",
                address: "202.80.104.115",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 14",
                address: "202.80.104.115",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 15",
                address: "202.80.104.116",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 16",
                address: "202.80.104.116",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 17",
                address: "202.80.104.117",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 18",
                address: "202.80.104.117",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 19",
                address: "202.80.104.118",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 20",
                address: "202.80.104.118",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 21",
                address: "202.80.104.119",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 22",
                address: "202.80.104.119",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 23",
                address: "202.80.104.120",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 24",
                address: "202.80.104.120",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 25",
                address: "202.80.104.121",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 26",
                address: "202.80.104.121",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 27",
                address: "202.80.104.122",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 28",
                address: "202.80.104.122",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 29",
                address: "202.80.104.123",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "Ch. 30",
                address: "202.80.104.123",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "購物商城",
                address: "202.80.104.43",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "拍賣所",
                address: "202.80.104.43",
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            },
            {
                icon: "Rhinne.png",
                english: "Rhinne",
                name: "非公開頻道",
                address: "202.80.104.35",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "優依娜"
            }
        ],
        '愛麗西亞': [
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 1",
                address: "202.80.104.124",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 2",
                address: "202.80.104.124",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 3",
                address: "202.80.104.125",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 4",
                address: "202.80.104.125",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 5",
                address: "202.80.104.126",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 6",
                address: "202.80.104.126",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 7",
                address: "202.80.104.127",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 8",
                address: "202.80.104.127",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 9",
                address: "202.80.104.128",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 10",
                address: "202.80.104.128",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 11",
                address: "202.80.104.129",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 12",
                address: "202.80.104.129",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 13",
                address: "202.80.104.130",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 14",
                address: "202.80.104.130",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 15",
                address: "202.80.104.131",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 16",
                address: "202.80.104.131",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 17",
                address: "202.80.104.132",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 18",
                address: "202.80.104.132",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 19",
                address: "202.80.104.133",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 20",
                address: "202.80.104.133",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 21",
                address: "202.80.104.134",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 22",
                address: "202.80.104.134",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 23",
                address: "202.80.104.135",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 24",
                address: "202.80.104.135",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 25",
                address: "202.80.104.136",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 26",
                address: "202.80.104.136",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 27",
                address: "202.80.104.137",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 28",
                address: "202.80.104.137",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 29",
                address: "202.80.104.138",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "Ch. 30",
                address: "202.80.104.138",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "購物商城",
                address: "202.80.104.44",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "拍賣所",
                address: "202.80.104.44",
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            },
            {
                icon: "Alicia.png",
                english: "Alicia",
                name: "非公開頻道",
                address: "202.80.104.36",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "愛麗西亞"
            }
        ],
        '殺人鯨': [
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 1",
                address: "202.80.104.139",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 2",
                address: "202.80.104.139",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 3",
                address: "202.80.104.140",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 4",
                address: "202.80.104.140",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 5",
                address: "202.80.104.141",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 6",
                address: "202.80.104.141",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 7",
                address: "202.80.104.142",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 8",
                address: "202.80.104.142",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 9",
                address: "202.80.104.143",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 10",
                address: "202.80.104.143",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 11",
                address: "202.80.104.144",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 12",
                address: "202.80.104.144",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 13",
                address: "202.80.104.145",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 14",
                address: "202.80.104.145",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 15",
                address: "202.80.104.146",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 16",
                address: "202.80.104.146",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 17",
                address: "202.80.104.147",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 18",
                address: "202.80.104.147",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 19",
                address: "202.80.104.148",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 20",
                address: "202.80.104.148",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 21",
                address: "202.80.104.149",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 22",
                address: "202.80.104.149",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 23",
                address: "202.80.104.150",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 24",
                address: "202.80.104.150",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 25",
                address: "202.80.104.151",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 26",
                address: "202.80.104.151",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 27",
                address: "202.80.104.152",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 28",
                address: "202.80.104.152",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 29",
                address: "202.80.104.153",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "Ch. 30",
                address: "202.80.104.153",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "購物商城",
                address: "202.80.104.45",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "拍賣所",
                address: "202.80.104.45",
                port: "8787",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            },
            {
                icon: "Orchid_TW.png",
                english: "Orchid",
                name: "非公開頻道",
                address: "202.80.104.37",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "殺人鯨"
            }
        ],
        Reboot: [
            {
                icon: "Reboot.png",
                name: "Ch. 1",
                address: "202.80.104.164",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 2",
                address: "202.80.104.164",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 3",
                address: "202.80.104.165",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 4",
                address: "202.80.104.165",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 5",
                address: "202.80.104.166",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 6",
                address: "202.80.104.166",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 7",
                address: "202.80.104.167",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 8",
                address: "202.80.104.167",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 9",
                address: "202.80.104.168",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 10",
                address: "202.80.104.168",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 11",
                address: "202.80.104.169",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 12",
                address: "202.80.104.169",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 13",
                address: "202.80.104.170",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 14",
                address: "202.80.104.170",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 15",
                address: "202.80.104.171",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 16",
                address: "202.80.104.171",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 17",
                address: "202.80.104.172",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 18",
                address: "202.80.104.172",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 19",
                address: "202.80.104.173",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 20",
                address: "202.80.104.173",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 21",
                address: "202.80.104.174",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 22",
                address: "202.80.104.174",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 23",
                address: "202.80.104.175",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 24",
                address: "202.80.104.175",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 25",
                address: "202.80.104.176",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 26",
                address: "202.80.104.176",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 27",
                address: "202.80.104.177",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 28",
                address: "202.80.104.177",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 29",
                address: "202.80.104.178",
                port: "8585",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Ch. 30",
                address: "202.80.104.178",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "購物商城",
                address: "202.80.104.47",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "非公開頻道",
                address: "202.80.104.39",
                port: "8686",
                interval: 1500,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ]
    },
}

var checker = {
    isMainPage: ko.observable(selected == "Main"),
    selected: ko.observable(selected),
    subSelection: ko.observable(subSelection),
    getDefaultSubSelectionForVersion: GetDefaultSubSelectionForVersion,
    modifySettings: ModifySettings,
    defaultSettings: DefaultSettings,
    getServersCountForApplication: GetServersCountForApplication,
    versions: [{
            abbr: "EMS",
            name: "MapleStory Europe",
            available: true,
            complete: false,
            icon: "Luna.png",
            short: "Europe",
            serverCount: [
                3,
                1,
                1
            ],
            applications: [
                GameServer("Europe", 0, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Luna.png",
                        name: "Luna",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.EMS.Login,
                    servers.EMS.Luna,
                    servers.EMS.Reboot,
                ]),
                {
                    name: "內部網頁",
                    description: "這些網頁託管在 Nexon 的伺服器上",
                    icons: [{
                            icon: "Nexon.png",
                            name: "nexon.net",
                            english: false,
                            sub: ""
                        }
                    ],
                    content: function() {
                        return new PingModel([
                            servers.EMS.InternalWebsites
                        ])
                    },
                    selectedServers: ko.observable(loadingArr)
                },
                {
                    name: "外部網頁",
                    description: "這些網頁託管在外部伺服器上",
                    selectedServers: ko.observable(loadingArr),
                    icons: [],
                    content: function() {
                        return new PingModel([
                            servers.EMS.ExternalWebsites
                        ])
                    }
                }
            ]
        },
        {
            abbr: "GMS",
            name: "MapleStory North America <small>(Global)</small>",
            available: true,
            complete: true,
            icon: "Scania.png",
            short: "North America (Global)",
            serverCount: [
                7,
				1
            ],
            applications: [
                GameServer("Global", 0, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "Scania",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bera.png",
                        name: "Bera",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "Elysium",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "Aurora",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    },
					{
                        icon: "Burning.png",
                        name: "Burning",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.GMS.Login,
                    servers.GMS.CrossWorld,
                    servers.GMS.Scania,
                    servers.GMS.Bera,
                    servers.GMS.Aurora,
                    servers.GMS.Elysium,
                    servers.GMS.Reboot,
					servers.GMS.Burning
                ]),
                {
                    name: "Websites",
                    description: "這邊是與 Nexon America 的內部和外部伺服器相關的網頁",
                    selectedServers: ko.observable(loadingArr),
                    icons: [{
                        icon: "Nexon.png",
                        name: "nexon.net",
                        english: false,
                        sub: "World"
                    }],
                    content: function() {
                        return new PingModel([
                            servers.GMS.Websites
                        ])
                    }
                }
            ]
        },
        {
            abbr: "JMS",
            name: "MapleStory Japan <small>(日本)</small>",
            available: true,
            complete: false,
            icon: "Kaede.png",
            short: "日本 | Japan",
            serverCount: [
                4
            ],
            applications: [
                GameServer("Japan", 9, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Kaede.png",
                        name: "かえで",
                        english: "Kaede",
                        sub: "World"
                    },
                    {
                        icon: "Kurumi.png",
                        name: "くるみ",
                        english: "Kurumi",
                        sub: "World"
                    },
                    {
                        icon: "Yukari.png",
                        name: "ゆかり",
                        english: "Yukari",
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "リブート",
                        english: "Reboot",
                        sub: "World"
                    }
                ], [
                    servers.JMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.JMS['かえで'],
                    servers.JMS['くるみ'],
                    servers.JMS['ゆかり'],
                    servers.JMS['リブート']
                ])
            ]
        },
        {
            abbr: "KMS",
            name: "MapleStory Korea <small>(한국)</small>",
            available: true,
            complete: false,
            icon: "Mushroom_16.png",
            short: "한국 | Korea",
            serverCount: [
                19
            ],
            applications: [
                GameServer("Korea", 9, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "스카니아",
                        english: "Scania",
                        sub: "World"
                    },
                    {
                        icon: "Bera.png",
                        name: "베라",
                        english: "Bera",
                        sub: "World"
                    },
                    {
                        icon: "Luna.png",
                        name: "루나",
                        english: "Luna",
                        sub: "World"
                    },
                    {
                        icon: "Zenith.png",
                        name: "제니스",
                        english: "Zenith",
                        sub: "World"
                    },
                    {
                        icon: "Croa.png",
                        name: "크로아",
                        english: "Croa",
                        sub: "World"
                    },
                    {
                        icon: "Union.png",
                        name: "유니온",
                        english: "Union",
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "엘리시움",
                        english: "Elysium",
                        sub: "World"
                    },
                    {
                        icon: "Enosis.png",
                        name: "이노시스",
                        english: "Enosis",
                        sub: "World"
                    },
                    {
                        icon: "Red.png",
                        name: "레드",
                        english: "Red",
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "오로라",
                        english: "Aurora",
                        sub: "World"
                    },
                    {
                        icon: "Arcane.png",
                        name: "아케인",
                        english: "Arcane",
                        sub: "World"
                    },
                    {
                        icon: "Nova.png",
                        name: "노바",
                        english: "Nova",
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "리부트",
                        english: "Reboot",
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "리부트2",
                        english: "Reboot2",
                        sub: "World"
                    },
                    {
                        icon: "TestWorld.png",
                        name: "테스트월드1",
                        english: "TestWorld1",
                        sub: "World"
                    },
                    {
                        icon: "TestWorld.png",
                        name: "테스트월드2",
                        english: "TestWorld2",
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "리부트T",
                        english: "RebootT",
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "리부트T2",
                        english: "RebootT2",
                        sub: "World"
                    }
                ], [
                    servers.KMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.KMS['스카니아'],
                    servers.KMS['베라'],
                    servers.KMS['루나'],
                    servers.KMS['제니스'],
                    servers.KMS['크로아'],
                    servers.KMS['유니온'],
                    servers.KMS['엘리시움'],
                    servers.KMS['이노시스'],
                    servers.KMS['레드'],
                    servers.KMS['오로라'],
                    servers.KMS['아케인'],
                    servers.KMS['노바'],
                    servers.KMS['리부트'],
                    servers.KMS['리부트2'],
                    servers.KMS['테스트월드1'],
                    servers.KMS['테스트월드2'],
                    servers.KMS['리부트T'],
                    servers.KMS['리부트T2']
                ])
            ]
        },
        {
            abbr: "CMS",
            name: "MapleStory China <small>(中国)</small>",
            available: true,
            complete: true,
            icon: "Lucid.png",
            short: "中国 | China",
            serverCount: [
                9
            ],
            applications: [
                GameServer("China", 8, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Lucid.png",
                        name: "路西德",
                        english: "Lucid",
                        sub: "World"
                    },
                    {
                        icon: "Will.png",
                        name: "威尔",
                        english: "Will",
                        sub: "World"
                    },
                    {
                        icon: "Orchid_CN.png",
                        name: "奥尔卡",
                        english: "Orchid",
                        sub: "World"
                    },
                    {
                        icon: "Damien.png",
                        name: "戴米安",
                        english: "Damien",
                        sub: "World"
                    },
                    {
                        icon: "Hilla.png",
                        name: "希拉",
                        english: "Hilla",
                        sub: "World"
                    },
                    {
                        icon: "VonLeon.png",
                        name: "班·雷昂",
                        english: "VonLeon",
                        sub: "World"
                    },
                    {
                        icon: "Magnus.png",
                        name: "麦格纳斯",
                        english: "Magnus",
                        sub: "World"
                    },
                    {
                        icon: "TestWorld.png",
                        name: "测试区",
                        english: "TestWorld",
                        sub: "World"
                    }
                ], [
                    servers.CMS.Login,
                    servers.CMS['路西德'],
                    servers.CMS['威尔'],
                    servers.CMS['奥尔卡'],
                    servers.CMS['戴米安'],
                    servers.CMS['希拉'],
                    servers.CMS['班·雷昂'],
                    servers.CMS['麦格纳斯'],
                    servers.CMS['测试区']
                ])
            ]
        },
        {
            abbr: "MSEA",
            name: "MapleStory SEA <small>(SG / MY)</small>",
            available: true,
            complete: false,
            icon: "Aquila.png",
            short: "Maple SEA SG / MY",
            serverCount: [
                5
            ],
            applications: [
                GameServer("SEA", 8, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Aquila.png",
                        name: "Aquila",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bootes.png",
                        name: "Bootes",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Cassiopeia.png",
                        name: "Cassiopeia",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Draco.png",
                        name: "Draco",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.MSEA.Login,
                    servers.MSEA.Aquila,
                    servers.MSEA.Bootes,
                    servers.MSEA.Cassiopeia,
                    servers.MSEA.Draco
                ])
            ]
        },
        {
            abbr: "TMS",
            name: "MapleStory Taiwan <small>台灣</small>",
            available: true,
            complete: false,
            icon: "Aria.png",
            short: "台灣 | Taiwan",
            serverCount: [
                11
            ],
            applications: [
                GameServer("Taiwan", 8, [{
                        icon: "Mushroom_16.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Aria.png",
                        name: "艾麗亞",
                        english: "Aria",
                        sub: "World"
                    },
					{
                        icon: "Freud.png",
                        name: "普力特",
                        english: "Freud",
                        sub: "World"
                    },
                    {
                        icon: "Ryude.png",
                        name: "琉德",
                        english: "Ryude",
                        sub: "World"
                    },
                    {
                        icon: "Rhinne.png",
                        name: "優依娜",
                        english: "Rhinne",
                        sub: "World"
                    },
                    {
                        icon: "Alicia.png",
                        name: "愛麗西亞",
                        english: "Alicia",
                        sub: "World"
                    },
                    {
                        icon: "Orchid_TW.png",
                        name: "殺人鯨",
                        english: "Orchid",
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.TMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.TMS['艾麗亞'],
                    servers.TMS['普力特'],
                    servers.TMS['琉德'],
                    servers.TMS['優依娜'],
                    servers.TMS['愛麗西亞'],
                    servers.TMS['殺人鯨'],
                    servers.TMS.Reboot
                ])
            ]
        }
    ],
    updateSelectedServers: UpdateSelectedServers,
    selectedIcon: ko.observable(GetEnglishIconNameForServer(this.subSelection)),
    settings: {
        pingOffset: ko.observable(0),
        delay: ko.observable(readCookie("Delay") ? readCookie("Delay") : 100),
        clickToRefresh: ko.observable(readCookie("ClickToRefresh") == "false" ? false : false),
        fixPing: ko.observable(readCookie("FixPing") == "false" ? false : true),
        showConnection: ko.observable(readCookie("ShowConnection") == "false" ? false : true),
        showIPPort: ko.observable(readCookie("ShowIPPort") == "false" ? false : true),
        timeout: ko.observable(readCookie("Timeout") ? readCookie("Timeout") : 5000),
        showControls: ko.observable(false)
    },
    currentTime: ko.observable('<span><i class="fa fa-cog fa-spin"></i> 正在檢查伺服器時間...</span>')
};

checker.subSelection.subscribe(function(newValue) {
    checker.selectedIcon(GetEnglishIconNameForServer(newValue));
});

if (selected != 'Main') {
    GetPingOffset();
}

ko.applyBindings(checker);

function GetEnglishIconNameForServer(serverName) {
    switch (serverName) {
        case "스카니아":
            return "Scania";
        case "베라":
            return "Bera";
        case "루나":
            return "Luna";
        case "제니스":
            return "Zenith";
        case "크로아":
            return "Croa";
        case "유니온":
            return "Union";
        case "엘리시움":
            return "Elysium";
        case "이노시스":
            return "Enosis";
        case "레드":
            return "Red";
        case "오로라":
            return "Aurora";
        case "아케인":
            return "Arcane";
        case "노바":
            return "Nova";
        case "리부트":
            return "Reboot";
        case "리부트2":
            return "Reboot";
        case "테스트월드1":
            return "TestWorld";
        case "테스트월드2":
            return "TestWorld";
        case "리부트T":
            return "Reboot";
        case "리부트T2":
            return "Reboot";
        case "Login":
            return "Mushroom";
        case "艾麗亞":
            return "Aria";
        case "普力特":
            return "Freud";
        case "琉德":
            return "Ryude";
        case "優依娜":
            return "Rhinne";
        case "愛麗西亞":
            return "Alicia";
        case "殺人鯨":
            return "Orchid_TW";
        case "เรด":
            return "Red";
        case "ออโรรา":
            return "Aurora";
        case "路西德":
            return "Lucid";
        case "威尔":
            return "Will";
        case "奥尔卡":
            return "Orchid_CN";
        case "戴米安":
            return "Damien";
        case "希拉":
            return "Hilla";
        case "班·雷昂":
            return "VonLeon";
        case "麦格纳斯":
            return "Magnus";
        case "测试区":
            return "TestWorld";
            case "かえで":
            return "Kaede";
        case "くるみ":
            return "Kurumi";
        case "ゆかり":
            return "Yukari";
        case "リブート":
            return "Reboot";
        default:
            return serverName;
    }
}

function UpdateSelectedServers(parent, index, name) {
    var name = name || checker.subSelection();

    if (loadingTimers.length > index) {
        window.clearInterval(loadingTimers[index]);
    }

    if (parent.name == "遊戲伺服器" && !clockTicking) {
        clockTicking = true;
        setTimeout(function() {
            setInterval(function() {
                var d = new Date(),
                    o = d.getTimezoneOffset() / 60;

                d.setHours(d.getHours() + o + parent.timeOffset);

                const fillZero = i => i < 10 ? '0' + i : i.toString();  // add zero in front of numbers < 10
                let Hms = [fillZero(d.getHours()), fillZero(d.getMinutes()), fillZero(d.getSeconds())];

                checker.currentTime(`
                    <span><i class="fa fa-clock-o"></i> 伺服器時間</span> ${Hms[0]}:${Hms[1]}:${Hms[2]}
                `);
            }, 1000);
        }, 1000 - new Date() % 1000);
        
    }

    parent.selectedServers(loadingArr);
    window.location.hash = '#' + checker.selected() + '-' + name;
    subSelection = name;
    checker.subSelection(name);

    loadingTimers.push(setTimeout(function() {
        var content = parent.content();
        parent.selectedServers(parent.content().servers());
    }, 300));
}

function GetCheckTimeout() {
    return checker.settings.timeout();
}

function GetPingOffset() {
    return new PingModel([{
        icon: "Mushroom_16.png",
        name: "Self",
        address: "127.0.0.1",
        port: "80",
        interval: 1500,
        values: [],
        unknown: true,
        rel: "Self"
    }]);
}

function GetDefaultSubSelectionForVersion(version) {
    switch (version) {
        case 'EMS':
            return 'Luna';
        case 'GMS':
            return 'Login';
        case 'JMS':
            return 'Login';
        case 'KMS':
            return '스카니아';
        case 'CMS':
            return 'Login';
        case 'MSEA':
            return 'Login';
		case 'TMS':
		    return 'Login';
        default:
            return;
    }
}

function SetPingOffset(offset) {
    checker.settings.pingOffset(offset);
}

function ModifySettings() {
    var delay = checker.settings.delay(),
        timeout = checker.settings.timeout();

    createCookie("Delay", delay > 10000 ? 10000 : (delay < 50 ? 50 : delay), 3650);
    createCookie("Timeout", timeout > 60000 ? 60000 : (timeout < 500 ? 500 : timeout), 3650);
    createCookie("ShowIPPort", checker.settings.showIPPort(), 3650);
    createCookie("ShowConnection", checker.settings.showConnection(), 3650);
    createCookie("ClickToRefresh", checker.settings.clickToRefresh(), 3650);
    createCookie("FixPing", checker.settings.fixPing(), 3650);

    window.location.reload();
}

function DefaultSettings() {
    checker.settings.delay(checkDelay);
    checker.settings.timeout(checkTimeout);
    checker.settings.showIPPort(showIPPort);
    checker.settings.showConnection(showConnection);
    checker.settings.clickToRefresh(clickToRefresh);
    checker.settings.fixPing(fixPing);
}

function GetServersCountForApplication(version, name) {
    var v = false;
    for (var i = 0; i < checker.versions.length; i++) {
        if (checker.versions[i].name == version) {
            v = checker.versions[i];
            break;
        }
    }

    if (v == false) {
        return 0;
    }

    for (var j = 0; j < v.applications.length; j++) {
        if (v.applications[j].name == name) {
            return v.serverCount[j];
        }
    }

    return 0;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
