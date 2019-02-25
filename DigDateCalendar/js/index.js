'use strict';

//created by kevin bissell 11/6/2018
//kevin.t.bissell@gmail.com
//time permitting, I'd like to add comments to the code at a later date.

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
moment.modifyHolidays.remove(['Christmas Eve', 'Columbus Day', 'Day after Thanksgiving','Easter sunday','Father\'s Day','Good Friday','Halloween','Mother\'s Day','Valentine\'s Day','Saint Patrick\'s Day','New Year\'s Eve']);

var Heading = function Heading(_ref) {
  var date = _ref.date;
  var changeMonth = _ref.changeMonth;
  var resetDate = _ref.resetDate;
  return React.createElement(
    'nav',
    { className: 'calendar--nav' },
    React.createElement(
      'a',
      { onClick: function onClick() {
          return changeMonth(date.month() - 1);
        } },
      '‹'
    ),
    React.createElement(
      'h1',
      { onClick: function onClick() {
          return resetDate();
        } },
      date.format('MMMM'),
      ' ',
      React.createElement(
        'small',
        null,
        date.format('YYYY')
      )
    ),
    React.createElement(
      'a',
      { onClick: function onClick() {
          return changeMonth(date.month() + 1);
        } },
      '›'
    )
  );
};

var Day = function Day(_ref2) {
  var currentDate = _ref2.currentDate;
  var date = _ref2.date;
  var startDate = _ref2.startDate;
  var endDate = _ref2.endDate;
  var _onClick = _ref2.onClick;

  var className = [];

  if (moment().isSame(date, 'day')) {
    className.push('active');
  }

  if (date.isSame(startDate, 'day')) {
    className.push('start');
  }

  if (date.isBetween(startDate, endDate, 'day')) {
    className.push('between');
  }

  if(date.isHoliday('holidays')){
    className.push('hday');
  }

  if (date.isSame(endDate, 'day')) {
    className.push('end');
  }

  if (!date.isSame(currentDate, 'month')) {
    className.push('muted');
  }

  return React.createElement(
    'span',
    { onClick: function onClick() {
        return _onClick(date);
      }, currentDate: date, className: className.join(' ') },
    date.date()
  );
};

var Days = function Days(_ref3) {
  var date = _ref3.date;
  var startDate = _ref3.startDate;
  var endDate = _ref3.endDate;
  var _onClick2 = _ref3.onClick;
  var thisDate = moment(date);
  var daysInMonth = moment(date).daysInMonth();
  var firstDayDate = moment(date).startOf('month');
  var previousMonth = moment(date).subtract(1, 'month');
  var previousMonthDays = previousMonth.daysInMonth();
  var nextsMonth = moment(date).add(1, 'month');
  var days = [];
  var labels = [];

// creates columns for each day of the week Sun(0) through Sat(6)
  for (var i = 0; i <= 6; i++) {
    labels.push(React.createElement(
      'span',
      { className: 'label' },
      moment().day(i).format('ddd')
    ));
  }

  for (var i = firstDayDate.day()+1; i > 1; i--) {
    previousMonth.date(previousMonthDays - i + 2);

    days.push(React.createElement(Day, { key: moment(previousMonth).format('DD MM YYYY'), onClick: function onClick(date) {
        return _onClick2(date);
      }, currentDate: date, date: moment(previousMonth), startDate: startDate, endDate: endDate }));
  }

  for (var i = 1; i <= daysInMonth; i++) {
    thisDate.date(i);

    days.push(React.createElement(Day, { key: moment(thisDate).format('DD MM YYYY'), onClick: function onClick(date) {
        return _onClick2(date);
      }, currentDate: date, date: moment(thisDate), startDate: startDate, endDate: endDate }));
  }

  var daysCount = days.length;
  for (var i = 1; i <= 42 - daysCount; i++) {
    nextsMonth.date(i);
    days.push(React.createElement(Day, { key: moment(nextsMonth).format('DD MM YYYY'), onClick: function onClick(date) {
        return _onClick2(date);
      }, currentDate: date, date: moment(nextsMonth), startDate: startDate, endDate: endDate }));
  }

  return React.createElement(
    'nav',
    { className: 'calendar--days' },
    labels.concat(),
    days.concat()
  );
  
};

var Calendar = function (_React$Component) {
  var clickState = 0;

  _inherits(Calendar, _React$Component);

  function Calendar(props) {
    _classCallCheck(this, Calendar);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      date: moment(),
      startDate: moment(),
      endDate: moment().clone().businessAdd(2, 'day').add(moment().clone().subtract(1).holidaysBetween(moment().clone().add(1).businessAdd(2,'days')).length) //end date is 2 full bus days after start date, and for each holiday in that 2 full business days, another business day is added. 
    };
    return _this;
  }

  Calendar.prototype.resetDate = function resetDate() {
    this.setState({
      date: moment(),
      startDate: moment(),
      endDate: moment().clone().businessAdd(2, 'day').add(moment().clone().subtract(1).holidaysBetween(moment().clone().businessAdd(2,'days').add(1)).length)
    });
  };

  Calendar.prototype.changeMonth = function changeMonth(month) {

    var date = this.state.date;
    date.month(month);
    this.setState(date);
  };
  
  Calendar.prototype.changeDate = function changeDate(date) {

    var _state = this.state;
    var startDate = _state.startDate;
    var endDate = _state.endDate;
      startDate = moment(date); //when changing date, this sets the start date to the day clicked
      endDate = startDate.clone().businessAdd(2, 'day').add(moment().clone().subtract(1).holidaysBetween(moment().clone().businessAdd(2,'days').add(1)).length); // sets the end date to 2 bus. days after end date
      if (clickState === 0) {
        this.setState({
            startDate: startDate,
            endDate: endDate
          });
        clickState = 1;


      } else {
        this.setState({
            startDate: startDate.clone().businessSubtract(2,'days'),
            endDate: moment(date)
          });
        clickState = 0;

      }
      
  };

  Calendar.prototype.render = function render() {
    var _this2 = this;
    var _state2 = this.state;
    var hDate = 0; //number of holidays in 'wait' period 
    var date = _state2.date;
    var startDate = _state2.startDate;
    var endDate = _state2.endDate;
    var statedEnd = endDate.clone().add(1, 'days');

    if((moment(startDate).clone().subtract(1)).holidaysBetween(moment(statedEnd).clone().businessAdd(1)).length > 0) {
      hDate += moment(startDate).holidaysBetween(statedEnd.clone()).length;
      endDate = endDate.businessAdd(hDate);

      }
      statedEnd = endDate.clone().add(1, 'days');

    return React.createElement(
      'div',
      { className: 'calendar' },
      React.createElement(Heading, { date: date, changeMonth: function changeMonth(month) {
          return _this2.changeMonth(month);
        }, resetDate: function resetDate() {
          return _this2.resetDate();
        } }),

      React.createElement(Days, { onClick: function onClick(date) {

          return _this2.changeDate(date);

        },
         date: date, startDate: startDate, endDate: endDate, statedEnd: statedEnd }),
                     // add elements in order to display statements
      React.createElement('p', {className: 'instructions'}, 'Filing a locate on '+startDate.format('MMM Do YYYY')),
      React.createElement('p', {className: 'instructions'}, 'should clear you to dig by '+statedEnd.format('MMM Do YYYY')),

    );
  };

  return Calendar;
}(React.Component);
ReactDOM.render(React.createElement(Calendar, null), document.getElementById('calendar'));

