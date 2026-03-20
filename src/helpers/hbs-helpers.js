/**
 * Handlebars Helpers (Benedict)
 */

module.exports = {
  /** Equality check: {{#if (eq a b)}} */
  eq: function (a, b) {
    return a === b;
  },

  /** Not equal: {{#if (neq a b)}} */
  neq: function (a, b) {
    return a !== b;
  },

  /** Format ISO date to "February 10, 2025" */
  formatDate: function (dateStr) {
    if (!dateStr) return '';
    var months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
    var d = new Date(dateStr);
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  },

  /** Parse date into { day, month, year } for reservation cards */
  parseDateDay: function (dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return String(d.getDate()).padStart(2, '0');
  },

  parseDateMonth: function (dateStr) {
    if (!dateStr) return '';
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return months[new Date(dateStr).getMonth()];
  },

  parseDateYear: function (dateStr) {
    if (!dateStr) return '';
    return String(new Date(dateStr).getFullYear());
  },

  /** Get initials from first and last name */
  getInitials: function (firstName, lastName) {
    return (firstName ? firstName.charAt(0) : '') + (lastName ? lastName.charAt(0) : '');
  },

  /** Capitalize first letter */
  capitalize: function (str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /** Multiply two numbers (for hours calculation) */
  multiply: function (a, b) {
    return (a * b).toFixed(1);
  },

  /** Math.min */
  min: function (a, b) {
    return Math.min(a, b);
  },

  /** Compute percentage */
  percentage: function (part, total) {
    if (!total || total === 0) return 100;
    return Math.round((part / total) * 100);
  },

  /** JSON stringify for passing data to client JS */
  json: function (context) {
    return JSON.stringify(context);
  },

  /** Check if value is in array */
  includes: function (arr, val) {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.indexOf(val) > -1;
  },

  /** Conditional class helper */
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
      case '==':  return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':  return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '<':   return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '>':   return (v1 > v2) ? options.fn(this) : options.inverse(this);
      default: return options.inverse(this);
    }
  },

  /** Get today's date as YYYY-MM-DD */
  today: function () {
    return new Date().toISOString().split('T')[0];
  },

  /** Get max date (7 days from now) as YYYY-MM-DD */
  maxDate: function () {
    var d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  },

  /** Lowercase helper */
  lowercase: function (str) {
    return str ? str.toLowerCase() : '';
  },

  /** Format timeSlots array for display.
   *  Single slot: "7:00 AM - 7:30 AM"
   *  Multiple slots: "7:00 AM - 8:30 AM (3 slots)" */
  formatTimeSlots: function (slots) {
    if (!slots || !Array.isArray(slots) || slots.length === 0) return '-';
    if (slots.length === 1) return slots[0];
    var first = slots[0].split(' - ')[0];
    var last = slots[slots.length - 1].split(' - ')[1];
    return first + ' - ' + last + ' (' + slots.length + ' slots)';
  }
};
