// -------------------------------------------------------------------------------------------------
// OpenSeaMap Water Depth - Web frontend for depth data handling.
//
// Written in 2012 by Dominik Fässler dfa@bezono.org
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
// -------------------------------------------------------------------------------------------------

OSeaM.models.GaugeMeasurements = Backbone.Collection.extend({
    model: OSeaM.models.GaugeMeasurement,
//    sortAttribute: "id",
//    sortDirection: 1,
//  
//    sortTracks: function (attr) {
//       this.sortAttribute = attr;
//       this.sort();
//    },
//  
//    comparator: function(a, b) {
//       var a = a.get(this.sortAttribute),
//           b = b.get(this.sortAttribute);
//  
//       if (a == b) return 0;
//  
//       if (this.sortDirection == 1) {
//          return a > b ? 1 : -1;
//       } else {
//          return a < b ? 1 : -1;
//       }
//    }
});
