/*
* Converte Data e Hora no Formato desejaado
*/

var datetime_format = function (datetime, format) {
	if ( datetime && format ) {
		if (datetime.length <= 10) datetime += " 00:00:00";
		
		var dt = new Date( datetime );
		
		d = dt.getDate();
		if (d<10) d = "0" + d;

		m = dt.getMonth()+1;
		if (m<10) m = "0" + m;

		y = dt.getFullYear();

		h = dt.getHours();
		if (h<10) h = "0" + h;

		i = dt.getMinutes();
		if (i<10) i = "0" + i;

		s = dt.getSeconds();
		if (s<10) s = "0" + s;

		if (format == 'd/m/y') return  d + '/' + m + '/' + y;
		if (format =='d/m/y h:i') return  d + '/' + m + '/' + y + ' ' + h + ':' + i;
		if (format == 'd/m/y h:i:s') return  d + '/' + m + '/' + y + ' ' + h + ':' + i + ':' + s;
		if (format == 'y-m-dTh:i') return  y + '-' + m + '-' + d + 'T' + h + ':' + i;		
	}
}