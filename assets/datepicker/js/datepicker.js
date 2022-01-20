$(function(){
	var settings={'fromY':0, 'toY':0, 'maxD': 0};
	var currDate={'yy':0, 'mm':0, 'dd':0};
	var today={'yy':2000, 'mm':1, 'dd':1};

	var date=new Date();
	currDate.yy=date.getFullYear();
	currDate.mm=date.getMonth()+1;
	// currDate.dd=date.getDate();
  currDate.dd=today.dd;

	settings.fromY=today.yy-50;
	settings.toY=date.getFullYear();
	settings.maxD=new Date(today.yy, today.mm, 0).getDate();

	dp_createYear();
	dp_createMonth();
	dp_createDay($('#dp_day28 ul'), 28, today.dd);
	dp_createDay($('#dp_day29 ul'), 29, today.dd);
	dp_createDay($('#dp_day30 ul'), 30, today.dd);
	dp_createDay($('#dp_day31 ul'), 31, today.dd);

	$('#dp_year').flickEndless({
		endless:true,
		increment:3,
		vertical:true,
		onPageChange: function() {
			// 繝壹�繧ｸ荳翫�菴咲ｽｮ縺ｪ縺ｮ縺ｧ荳縺､荳九′繝槭�繧ｫ繝ｼ
			var page=(this.page==this.count) ? 0 : this.page;
			currDate.yy=settings.fromY+page;
			var $day=dp_selectDay(currDate.yy, currDate.mm);
      $('#birth-year').val(currDate.yy);
			if(currDate.dd>settings.maxD) currDate.dd=settings.maxD;
			$day.flickEndless('silentGoto',  (currDate.dd>1) ? currDate.dd-1 : settings.maxD);
		}
	}).flickEndless('silentGoto', dp_selectYear(today.yy-1));

	$('#dp_month').flickEndless({
		endless:true,
		vertical:true,
		onPageChange: function() {
			// 繝壹�繧ｸ荳翫�菴咲ｽｮ縺ｪ縺ｮ縺ｧ荳縺､荳九′繝槭�繧ｫ繝ｼ
			currDate.mm=(this.page==this.count) ? 1 : this.page+1;
			var $day=dp_selectDay(currDate.yy, currDate.mm);
      $('#birth-month').val(currDate.mm);
			if(currDate.dd>settings.maxD) currDate.dd=settings.maxD;
			$day.flickEndless('silentGoto',  (currDate.dd>1) ? currDate.dd-1 : settings.maxD);
		}
	}).flickEndless('silentGoto', today.mm-1);

	$('#dp_day28').flickEndless({
		endless:true,
		vertical:true,
		onPageChange: function() {
			// 繝壹�繧ｸ荳翫�菴咲ｽｮ縺ｪ縺ｮ縺ｧ荳縺､荳九′繝槭�繧ｫ繝ｼ
			currDate.dd=(this.page==this.count) ? 1 : this.page+1;
      $('#birth-date').val(currDate.dd);
		}
	}).flickEndless('silentGoto', today.dd-1);

	$('#dp_day29').flickEndless({
		endless:true,
		vertical:true,
		onPageChange: function() {
			// 繝壹�繧ｸ荳翫�菴咲ｽｮ縺ｪ縺ｮ縺ｧ荳縺､荳九′繝槭�繧ｫ繝ｼ
			currDate.dd=(this.page==this.count) ? 1 : this.page+1;
      $('#birth-date').val(currDate.dd);
		}
	}).flickEndless('silentGoto', today.dd-1);

	$('#dp_day30').flickEndless({
		endless:true,
		vertical:true,
		onPageChange: function() {
			// 繝壹�繧ｸ荳翫�菴咲ｽｮ縺ｪ縺ｮ縺ｧ荳縺､荳九′繝槭�繧ｫ繝ｼ
			currDate.dd=(this.page==this.count) ? 1 : this.page+1;
      $('#birth-date').val(currDate.dd);
		}
	}).flickEndless('silentGoto', today.dd-1);

	$('#dp_day31').flickEndless({
		// endless:true,
		vertical:true,
		onPageChange: function() {
			// 繝壹�繧ｸ荳翫�菴咲ｽｮ縺ｪ縺ｮ縺ｧ荳縺､荳九′繝槭�繧ｫ繝ｼ
			currDate.dd=(this.page==this.count) ? 1 : this.page+1;
      $('#birth-date').val(currDate.dd);
		}
	}).flickEndless('silentGoto', today.dd-1);

	// $('#dp_ok').bind('click', function() {
	// 	var arg={
	// 		'yy': String(currDate.yy+10000).substr(-4),
	// 		'mm': String(currDate.mm+100).substr(-2),
	// 		'dd': String(currDate.dd+100).substr(-2)
	// 	}
  //   $('#birth').val(arg.yy+'/'+arg.mm+'/'+arg.dd);
	// });

	// $('#dp_can').bind('click', function() {
	// 	alert('cancel');
	// });

	// $('#dp_reset').bind('click', function() {
	// 	currDate.yy=today.yy;
	// 	currDate.mm=today.mm;
	// 	currDate.dd=today.dd;

	// 	settings.fromY=today.yy-1;
	// 	settings.toY=today.yy+3;
	// 	settings.maxD=new Date(today.yy, today.mm, 0).getDate();


	// 	$('#dp_year').flickEndless('silentGoto', dp_selectYear(today.yy-1));
	// 	$('#dp_month').flickEndless('silentGoto', today.mm-1);
	// 	var $day=dp_selectDay(today.yy, today.mm);
	// 	$day.flickEndless('silentGoto', today.dd-1);
	// });

	var $div = $('<div />');
	if (typeof $div.css('pointer-events') !== 'string' || (/*@cc_on!@*/false) ) {
		$('.dp_view').css('z-index', 1);
		$('.dp_smoke').each(function() {
			$(this).css('background-color', 'transparent');
		});
	}


//--------------------------------------------------------------------------
	function dp_createDay($elm, count, dd) {
		$elm.children('li').each(function() {
			$(this).remove();
		});
		for(var i=1; i<=count; i++) {
			var $day=$('<li>'+i+'</li>').appendTo($elm);
			// if(i==dd) $day.addClass('dp_now');
		}
	}

	function dp_selectDay(yy, mm) {
		settings.maxD=new Date(yy, mm, 0).getDate();
		var id='dp_day'+settings.maxD;
		$('.dp_dd').each(function() {
			if($(this).attr('id')==id) {
				$(this).show();
			}
			else {
				$(this).hide();
			}
		});
		return $('#'+id);
	}

	function dp_selectYear(yy) {
		var year=yy;
		if(year<settings.fromY) {
			year=settings.toY;
		}
		else {
			if(year>settings.toY) {
				year=settings.fromY;
			}
		}
		return year-settings.fromY+1;
	}

	function dp_createYear() {
		$('#dp_year ul').children().each(function() {
			$(this).remove();
		});
		for(var i=settings.fromY; i<=settings.toY; i++) {
			var $year=$('<li>'+i+'</li>').appendTo($('#dp_year ul'));
			// if(i==today.yy) $year.addClass('dp_now');
		}
	}

	function dp_createMonth() {
		$('#dp_month ul').children().each(function() {
			$(this).remove();
		});
		for(var i=1; i<=12; i++) {
			var $month=$('<li>'+i+'</li>').appendTo($('#dp_month ul'));
			// if(i==today.mm) $month.addClass('dp_now');
		}
	}

	dp_selectDay(today.yy, today.mm);
});