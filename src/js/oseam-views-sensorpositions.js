// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2012 by Dominik Fässler dfa@bezono.org
// Written in 2013 by Dominik Fässler dfa@bezono.org
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.views.SensorPositions = Backbone.View.extend({
    horizontalDistance:0,
    verticalDistance:0,
    leftDevice:'echo',
    topDevice:'echo',
    width:200,
    height:280,
    border:30,
    sideSpace:40,
    factor:1,
    textHeight:18,
    echoSensorX:0,
    echoSensorY:0,
    gpsAntennaX:0,
    gpsAntennaY:0,
    canvas:null,
    render: function() {
        this.calculatePositions();
        this.refresh();
    },
    setHorizontalDistance:function(value) {
        this.horizontalDistance = value;
        this.calculatePositions();
        this.refresh();
    },
    setVerticalDistance:function(value) {
        this.verticalDistance = value;
        this.calculatePositions();
        this.refresh();
    },
    setLeftDevice:function(value) {
        this.leftDevice = value;
        this.calculatePositions();
        this.refresh();
    },
    setTopDevice:function(value) {
        this.topDevice = value;
        this.calculatePositions();
        this.refresh();
    },
    refresh:function() {
        if (this.canvas === null) {
            this.canvas = Raphael(this.el, this.width, this.height);
        } else {
            this.canvas.clear();
        }

        // Border
        this.canvas.rect(0, 0, this.width, this.height, 5).attr({
            stroke:'#666',
            fill:'#F0F0F0'
        });

        if ((this.horizontalDistance + this.verticalDistance) <= 0) {
            return;
        }

        // Echo sensor
        this.canvas.rect(this.echoSensorX - 10, this.echoSensorY - 10, 20, 20).attr({
            stroke:'#000'
        });
        this.canvas.text(this.echoSensorX, this.echoSensorY - this.textHeight, 'ECHO').attr({
            font:'12px Helvetica',
            'font-weight': 'bold',
            fill:'#666',
            'text-anchor': 'middle'
        });

        // GPS antenna
        this.canvas.circle(this.gpsAntennaX, this.gpsAntennaY, 10).attr({
            stroke:'#000'
        });
        this.canvas.text(this.gpsAntennaX, this.gpsAntennaY - this.textHeight, 'GPS').attr({
            font:'12px Helvetica',
            'font-weight': 'bold',
            fill:'#666',
            'text-anchor': 'middle'
        });

        // Horizontal distance
        bottomYLine = this.height - this.border - 14;
        this.printHorizontalLine(bottomYLine, this.gpsAntennaX, this.gpsAntennaY, this.echoSensorX, this.echoSensorY);

        // Vertical distance
        rightXLine = this.width - this.border - 14;
        this.printVerticalLine(rightXLine, this.gpsAntennaX, this.gpsAntennaY, this.echoSensorX, this.echoSensorY);
    },
    calculatePositions:function() {
        this.calculateFactor();
        if (this.leftDevice === 'gps') {
            this.gpsAntennaX = this.border;
            this.echoSensorX = this.getPos(this.horizontalDistance);
        } else {
            this.echoSensorX = this.border;
            this.gpsAntennaX = this.getPos(this.horizontalDistance);
        }
        if (this.topDevice === 'gps') {
            this.gpsAntennaY = this.border + this.textHeight;
            this.echoSensorY = this.getPos(this.verticalDistance);
        } else {
            this.echoSensorY = this.border + this.textHeight;
            this.gpsAntennaY = this.getPos(this.verticalDistance);
        }
    },
    calculateFactor:function() {
        var factorX = (this.width  - this.sideSpace - (2 * this.border)) / this.horizontalDistance;
        var factorY = (this.height - this.sideSpace - (2 * this.border)) / this.verticalDistance;
        this.factor = Math.min(factorX, factorY);
    },
    getPos:function(p) {
        p = (p * this.factor) - this.sideSpace;
        if (p < 0) {
            p = 0;
        } else if (p < 70) {
            p = 70;
        }
        return this.border + p;
    },
    printDiagonalLine:function(x, y) {
        this.canvas.path('M' + (x - 7) + ',' + (y + 7) + 'L' + (x + 7) + ',' + (y - 7));
    },
    printVerticalLine:function(x, xA, yA, xB, yB) {
        var t = 0;
        if (yB < yA) {
            t = xB;
            xB = xA;
            xA = t;
            t = yB;
            yB = yA;
            yA = t;
        }
        if ((yB - yA) === 0) {
            return;
        }
        this.canvas.path('M' + (xA + 3) + ',' + yA + 'L' + (x + 14) + ',' + yA);
        this.canvas.path('M' + (xB + 3) + ',' + yB + 'L' + (x + 14) + ',' + yB);
        this.canvas.path('M' + x + ',' + (yA - 14) + 'L' + x + ',' + (yB + 14));
        this.printDiagonalLine(x, yA);
        this.printDiagonalLine(x, yB);
        text = this.canvas.text(x + 14, yA + ((yB - yA) / 2), (this.verticalDistance / 100).toFixed(2) + ' m');
        text.rotate(-90);
        text.attr('font-size', 14);
    },
    printHorizontalLine:function(y, xA, yA, xB, yB) {
        var t = 0;
        if (xB < xA) {
            t = xB;
            xB = xA;
            xA = t;
            t = yB;
            yB = yA;
            yA = t;
        }
        if ((xB - xA) === 0) {
            return;
        }
        this.canvas.path('M' + xA + ',' + (yA + 3) + 'L' + xA + ',' + (y + 14));
        this.canvas.path('M' + xB + ',' + (yB + 3) + 'L' + xB + ',' + (y + 14));
        this.canvas.path('M' + (xA - 14) + ',' + y + 'L' + (xB + 14) + ',' + y);
        this.printDiagonalLine(xA, y);
        this.printDiagonalLine(xB, y);
        text = this.canvas.text(xA + ((xB - xA) / 2), y + 14, (this.horizontalDistance / 100).toFixed(2) + ' m');
        text.attr('font-size', 14);
    }
});