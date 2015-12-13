/**
 * Created by zhangxiaoxue on 10/22/15.
 */
$(function(){

    //instantiate the Twitter class in Twitter.js, so I can use the methods in Twitter class later
    var twitter = new Twitter();

    /*
        Map Section
     */
    var width = $(window).width(),
        height = $(window).height();

    var projection = d3.geo.mercator()
        .scale(220)
        .translate([width / 2, height / 2])
        .precision(.1)
        .rotate([80, 0]);

    var path = d3.geo.path()
        .projection(projection);

    var graticule = d3.geo.graticule();

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g");

    g.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    // load and display the World
    d3.json("data/world-50m.json", function(error, world) {
        if (error) throw error;

        g.insert("path", ".graticule")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .attr("d", path);

        g.insert("path", ".graticule")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "boundary")
            .attr("d", path);

        // display points on a map
        d3.csv("data/cities.csv", function(error, data) {
            // tooltips
            var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


            g.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return projection([d.lon, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("r", 8)
                .attr("class", "glow")
                // add tooltips
                .on("mouseover", function(d){
                    var tooltipCnt = d.city;

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(tooltipCnt)
                        .style("left", (d3.event.pageX) + 3 + "px")
                        .style("top", (d3.event.pageY - 38) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                //add click event and show the poetry according to the current city
                .on("click", function(d){
                    var city = d.city;
                    d3.selectAll(".glow").attr("class", "target");
                    d3.select(this).attr("class", "glow");

                    //if panel is not showing, then show panel
                    var showPanel = function(data){
                        var $panel = $("#panel-poetry");

                        //show current city on the panel
                        $(".panel-title .city", $panel).text(data.city);
                        //show generated poem on the panel
                        $(".panel-content", $panel).html(data.poem);

                        if(!$panel.hasClass("visibility")){
                            //$panel.fadeIn("show");

                            $panel.addClass('visibility animated fadeIn');
                            //callback
                            $panel.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                //attach the close event
                                $panel.on("click", ".close", function(e){
                                    e.preventDefault();

                                    //close the panel
                                    $panel.removeClass("visibility");
                                });

                            });
                        }
                    };

                    twitter.getPoemByCity(city, showPanel);
                });

            /*
                Animation Section
             */
            //when the map is prepared, remove loading effect and show the typing effect
            $("#map").fadeIn("slow");
            $(".preloader-icon").delay(300).fadeOut("slow", function(){
                //after loading icon disappears, the introduction of the project will appear
                $(".preloader-text-line, .btn-start").addClass('visibility animated fadeInUp');

                //after the intro information disappears, show the map
                //$(".preloader").delay("2400").fadeOut("slow");

                $(".btn-start").on("click", function(e){
                    e.preventDefault();
                    $(".preloader").fadeOut();
                });
            });
        });
    });

    d3.select(self.frameElement).style("height", height + "px");

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom",function() {
            var t = d3.event.translate,
                s = d3.event.scale;
            t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
            t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
            zoom.translate(t);
            g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
        });

    svg.call(zoom)

});
