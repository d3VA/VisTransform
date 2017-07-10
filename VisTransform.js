(function() {
    (function() {
        function t(t, e, i) {
            this.graph = e, this.layout_mode = i, this.MARGIN = t.VIS, this.layout = new Layout(t, this.graph, this.layout_mode), 
            this.radialPlacement = new RadialPlacement();
        }
        t.prototype.WIDTH = 950, t.prototype.HEIGHT = 950, t.prototype.FILTER_SIZE = 0, 
        t.prototype.RADIUS = 200, t.prototype.ORBIT_NR = 24, t.prototype.GRAVITY = -10, 
        t.prototype.MARGIN = null, t.prototype.graph = null, t.prototype.layout = null, 
        t.prototype.radialPlacement = null, t.prototype.sort_mode = "sort_clusters", t.prototype.clustering_dfield = null, 
        t.prototype.linkedByIndex = {}, t.prototype.allData = null, t.prototype.curNodesData = null, 
        t.prototype.curLinksData = null, t.prototype.createVis = function(t, e) {
            var i;
            return this.allData = this.setupData(e), (i = d3.select(t).append("svg").attr("id", "main_svg").attr("width", this.WIDTH).attr("height", this.HEIGHT).style("margin-top", this.MARGIN.top).style("margin-left", this.MARGIN.left)).append("g").attr("id", "links").attr("transform", "scale(" + this.MARGIN.scale + ")"), 
            i.append("g").attr("id", "nodes").attr("transform", "scale(" + this.MARGIN.scale + ")");
        }, t.prototype.setupData = function(t) {
            var e, i, r;
            return this.graph.removeNodesLinks(), r = d3.extent(t.nodes, function(t) {
                return t.playcount;
            }), e = d3.scale.sqrt().range([ 3, 12 ]).domain(r), t.nodes.forEach(function(t) {
                return function(i) {
                    return i.x = Math.floor(Math.random() * t.WIDTH), i.y = Math.floor(Math.random() * t.HEIGHT), 
                    i.radius = e(i.playcount);
                };
            }(this)), i = this.mapNodes(t.nodes), t.links.forEach(function(t) {
                return function(e) {
                    return e.source = i.get(e.source), e.target = i.get(e.target), t.linkedByIndex[e.source.id + "," + e.target.id] = 1;
                };
            }(this)), this.graph.linkedByIndex = this.linkedByIndex, this.allData = t, t;
        }, t.prototype.createClusteringSelectBox = function() {
            return $("#clustering_select").html(""), [ {
                dfield: "artist",
                label: "artist"
            }, {
                dfield: "name",
                label: "name"
            }, {
                dfield: "license",
                label: "license"
            }, {
                dfield: "version",
                label: "version"
            }, {
                dfield: "TView",
                label: "task view"
            }, {
                dfield: "TViewCount",
                label: "number of task views"
            }, {
                dfield: "pub_date",
                label: "publication date"
            }, {
                dfield: "memb_names",
                label: "author"
            } ].forEach(function(t) {
                return function(e) {
                    var i;
                    return i = e.dfield === t.clustering_dfield ? "<option value='" + e.dfield + "' selected>" + e.label + "</option>" : "<option value='" + e.dfield + "'>" + e.label + "</option>", 
                    $("#clustering_select").append(i);
                };
            }(this));
        }, t.prototype.filterGraph = function(t) {
            return this.layout_mode = t, $("#main_svg").css("margin-left", this.MARGIN.left).css("margin-top", this.MARGIN.top), 
            this.clustering_dfield = this.graph.clustering_dfield, this.createClusteringSelectBox(), 
            this.filterNodes(), this.filterLinks(), "radial" === this.layout_mode && this.updateCenters(), 
            this.layout.updateLegends(this.curNodesData, this.layout_mode), this.graph.clusters_array = this.layout.getMatchingNodes(this.curNodesData, this.clustering_dfield);
        }, t.prototype.filterNodes = function() {
            var t, e;
            return t = this.allData.nodes, e = this.layout.size_filter(t, this.FILTER_SIZE, "playcount"), 
            e = this.layout.legend_filter(e), this.graph.curNodesData = e, this.curNodesData = e;
        }, t.prototype.filterLinks = function() {
            var t, e;
            return t = this.allData.links, e = this.mapNodes(this.curNodesData), this.curLinksData = t.filter(function(t) {
                return e.get(t.source.id) && e.get(t.target.id);
            }), this.graph.curLinksData = this.curLinksData;
        }, t.prototype.switch_filter = function(t, e) {
            return this.layout.switch_filter(t, e);
        }, t.prototype.clusteredNodes = function() {
            var t, e;
            return t = [], "sort_links" === this.sort_mode ? (e = {}, this.curLinksData.forEach(function(t) {
                return function(i) {
                    var r, n;
                    return null == e[r = i.source[t.clustering_dfield]] && (e[r] = 0), e[i.source[t.clustering_dfield]] += 1, 
                    null == e[n = i.target[t.clustering_dfield]] && (e[n] = 0), e[i.target[t.clustering_dfield]] += 1;
                };
            }(this)), this.curNodesData.forEach(function(t) {
                return function(i) {
                    var r;
                    return null != e[r = i[t.clustering_dfield]] ? e[r] : e[r] = 0;
                };
            }(this)), t = (t = d3.entries(e).sort(function(t, e) {
                return e.value - t.value;
            })).map(function(t) {
                return t.key;
            })) : (e = this.layout.getMatchingNodes(this.curNodesData, this.clustering_dfield), 
            t = (t = d3.entries(e).sort(function(t, e) {
                return e.value - t.value;
            })).map(function(t) {
                return t.key;
            })), t;
        }, t.prototype.updateCenters = function() {
            var t;
            return t = this.clusteredNodes(), this.radialPlacement.setPositions({
                x: this.WIDTH / 2,
                y: this.HEIGHT / 2 - 30
            }, this.RADIUS, 360 / this.ORBIT_NR, t);
        }, t.prototype.moveToRadialLayout = function(t) {
            var e;
            return e = .1 * t, function(t) {
                return function(i) {
                    var r;
                    return r = t.radialPlacement.getPosition(i[t.clustering_dfield]), i.x += (r.x - i.x) * e, 
                    i.y += (r.y - i.y) * e;
                };
            }(this);
        }, t.prototype.mapNodes = function(t) {
            var e;
            return e = d3.map(), t.forEach(function(t) {
                return e.set(t.id, t);
            }), e;
        };
    })();
}).call(this);