function init ($inputfield, fields) {
	$inputfield.find('.InputfieldHeader:not(.AdminHelperLinksInit) > i.toggle-icon').each(function() {
		$(this).off('hover');

		var $header = $(this).closest('.InputfieldHeader');
		var $label = $(this).parent('label');
		if($label.length == 0) return;

		var forId = $label.attr('for');
		if(!forId) forId = $label.parent().attr('id');
		if(!forId) return;

		var fieldName = forId
			.replace(/^Inputfield_|wrap_Inputfield_|wrap_/, '')
			.replace(/_repeater.*$/, '');
		var field = fields.find(f => f.name === fieldName);

		if(field) {
			var $link = $("<a class='AdminHelperLinksLink'>");
			$link.attr('title', 'Edit field: ' + fieldName);
			$link.attr('href', '/admin/setup/field/edit?id=' + field.id);
			$link.append("<div class='keep-height'>&nbsp;</div>");
			$link.append("<i class='fa fa-cog'></i></span>");

			$link.click(function (event) {
				event.stopPropagation();
			})

			$(this).append($link);

			$header.addClass('AdminHelperLinksInit');
		}
	});
}

jQuery(document).ready(function($) {
	console.log("HFL");
	$.ajax('/admin/setup/field', {
		headers: {
			'X-Requested-With': 'XMLHttpRequest'
		}
	}).then((fields) => {
		console.log(fields);

		init($('.Inputfield'), fields);

		$(document).on('reloaded', '.Inputfield', function() {
			init($(this), fields);
		});
	});
});
