
/* 
 * KODataTable
 * http://mikeallisononline.com/
 *
 * Dependent on Knockout and jQuery
 * http://knockoutjs.com/
 * http://jquery.com/
 *
 * Optional table scrolling with jTableScroll
 * http://mikeallisononline.com/
 *
 * Copyright 2013 Mike Allison
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */

(function() {
  window.KODataTable = (function() {
    function KODataTable(options) {
      var ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
      this.options = options;
      this.searchText = ko.observable((ref = (ref1 = this.options) != null ? ref1.searchText : void 0) != null ? ref : "");
      this.columns = ko.observableArray((ref2 = (ref3 = this.options) != null ? ref3.columns : void 0) != null ? ref2 : []);
      this.rows = ko.observableArray((ref4 = (ref5 = this.options) != null ? ref5.rows : void 0) != null ? ref4 : []);
      this.currentPage = ko.observable((ref6 = (ref7 = this.options) != null ? ref7.currentPage : void 0) != null ? ref6 : 0);
      this.pageSize = ko.observable((ref8 = (ref9 = this.options) != null ? ref9.pageSize : void 0) != null ? ref8 : 20);
      this.selectedColumn = ko.observable((ref10 = (ref11 = this.options) != null ? ref11.selectedColumn : void 0) != null ? ref10 : 0);
      this.tableHeight = (ref12 = (ref13 = this.options) != null ? ref13.tableHeight : void 0) != null ? ref12 : 0;
      this.tableWidth = (ref14 = (ref15 = this.options) != null ? ref15.tableWidth : void 0) != null ? ref14 : 0;
      this.sortDir = (ref16 = (ref17 = this.options) != null ? ref17.sortDir : void 0) != null ? ref16 : [];
      this.autoSearch = (ref18 = (ref19 = this.options) != null ? ref19.autoSearch : void 0) != null ? ref18 : true;
      this.selectedRow = ko.observable(((ref20 = this.options) != null ? ref20.selectedRow : void 0) != null);
      this.filter = ko.observable(this.searchText());
      if (this.autoSearch) {
        this.throttleSearch = ko.computed((function(_this) {
          return function() {
            return _this.filter(_this.searchText());
          };
        })(this));
        this.throttleSearch.extend({
          throttle: 300
        });
      }
      this.filteredRows = ko.computed((function(_this) {
        return function() {
          var filter;
          filter = _this.filter().toLowerCase();
          if (!filter) {
            return _this.rows();
          } else {
            return ko.utils.arrayFilter(_this.rows(), function(item) {
              return item[_this.selectedColumn()].toString().toLowerCase().indexOf(filter) > -1;
            });
          }
        };
      })(this));
      this.currentRows = ko.computed((function(_this) {
        return function() {
          if ((_this.currentPage() + 1) * _this.pageSize() > _this.filteredRows().length) {
            return _this.filteredRows().slice(_this.currentPage() * _this.pageSize());
          } else {
            return _this.filteredRows().slice(_this.currentPage() * _this.pageSize(), +((_this.currentPage() + 1 * _this.pageSize()) - 1) + 1 || 9e9);
          }
        };
      })(this));
      this.pageCount = ko.computed((function(_this) {
        return function() {
          return Math.ceil(_this.filteredRows().length / _this.pageSize());
        };
      })(this));
      this.nextFn = ((ref21 = this.options) != null ? ref21.nextFn : void 0) != null;
      this.prevFn = ((ref22 = this.options) != null ? ref22.prevFn : void 0) != null;
      this.searchFn = ((ref23 = this.options) != null ? ref23.searchFn : void 0) != null;
      this.sortFn = ((ref24 = this.options) != null ? ref24.sortFn : void 0) != null;
      this.lastFn = ((ref25 = this.options) != null ? ref25.lastFn : void 0) != null;
      this.firstFn = ((ref26 = this.options) != null ? ref26.firstFn : void 0) != null;
      this.selectFn = ((ref27 = this.options) != null ? ref27.selectFn : void 0) != null;
      if (typeof jQuery.fn.jTableScroll === "function") {
        jQuery((function(_this) {
          return function() {
            return jQuery('.jTableScroll').jTableScroll({
              height: _this.tableHeight,
              width: _this.tableWidth
            });
          };
        })(this));
      }
    }

    KODataTable.prototype.nextPage = function() {
      if ((this.currentPage() + 1) * this.pageSize() < this.filteredRows().length) {
        if (typeof this.nextFn === "function") {
          this.nextFn();
        }
        return this.currentPage(this.currentPage() + 1);
      }
    };

    KODataTable.prototype.prevPage = function() {
      if (this.currentPage() > 0) {
        if (typeof this.prevFn === "function") {
          this.prevFn();
        }
        return this.currentPage(this.currentPage() - 1);
      }
    };

    KODataTable.prototype.lastPage = function() {
      if (typeof this.lastFn === "function") {
        this.lastFn();
      }
      return this.currentPage(Math.ceil(this.filteredRows().length / this.pageSize()) - 1);
    };

    KODataTable.prototype.firstPage = function() {
      if (typeof this.firstFn === "function") {
        this.firstFn();
      }
      return this.currentPage(0);
    };

    KODataTable.prototype.search = function() {
      if (typeof this.searchFn === "function") {
        this.searchFn();
      }
      this.filter(this.throttleSearch()());
      return this.currentPage(0);
    };

    KODataTable.prototype.sort = function(index) {
      var ref;
      if (typeof this.sortFn === "function") {
        return this.sortFn(index);
      } else {
        if (!this.sortDir[index]) {
          this.sortDir[index] = "A";
        }
        this.rows.sort((function(_this) {
          return function(left, right) {
            if (_this.sortDir[index] === "A") {
              if (left[_this.columns()[index]] === right[_this.columns()[index]]) {
                return 0;
              } else if (left[_this.columns()[index]] < right[_this.columns()[index]]) {
                return -1;
              } else {
                return 1;
              }
            } else {
              if (left[_this.columns()[index]] === right[_this.columns()[index]]) {
                return 0;
              } else if (left[_this.columns()[index]] > right[_this.columns()[index]]) {
                return -1;
              } else {
                return 1;
              }
            }
          };
        })(this));
        return this.sortDir[index] = (ref = this.sortDir[index] === "A") != null ? ref : {
          "D": "A"
        };
      }
    };

    KODataTable.prototype.selectRow = function(data) {
      this.selectedRow(data);
      return typeof this.selectFn === "function" ? this.selectFn() : void 0;
    };

    return KODataTable;

  })();

}).call(this);
