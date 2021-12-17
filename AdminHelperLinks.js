function getPageTemplateName() {
	var $pageEditProcess = $('#ProcessPageEdit');

	if (!$pageEditProcess.length) {
		return;
	}

	var templateClass = $pageEditProcess.attr('class').split(/\s+/).find(c => c.startsWith('template_'));
	var templateName = templateClass && templateClass.replace(/^template_/, '');

	return templateName;
}

function getFieldName($label) {
	var forId = $label.attr('for');
	if(!forId) forId = $label.parent().attr('id');
	if(!forId) return;

	var fieldName = forId
		.replace(/^Inputfield_|wrap_Inputfield_|wrap_/, '')
		.replace(/_repeater.*$/, '');

	return fieldName;
}

function initField($inputfield) {
	$inputfield.find('.InputfieldHeader:not(.ahl--init) > i.toggle-icon').each(function() {
		$(this).off('hover');

		var $header = $(this).closest('.InputfieldHeader');
		var $label = $(this).parent('label');

		if($label.length == 0) return;

		var fieldName = getFieldName($label);
		var fieldId = ProcessWire.config.AdminHelperLinks.fieldIds[fieldName];

		$links = $("<div class='ahl' title=''>");
		$(this).append($links);

		$hoverContent = $("<div class='ahl__hover-content'>");

		$backgroundFade = $("<span class='ahl__background-fade'>&nbsp;</span>");

		$links.on('hover', function () {
			var color = $(this).parent('.toggle-icon').css("background-color");
			$('.ahl__background-fade').css("background", "linear-gradient(to left, " + color + ", transparent)");
		})

		$hoverContent.append($backgroundFade);
		$hoverContent.append("<span class='ahl__field-name' title='Field name'>" + fieldName + "</span>");
		$hoverContent.find('> *:not(a)').on('click', (event) => event.stopPropagation());

		$links.append($hoverContent);

		if(fieldId) {
			var $editLink = $("<a>");
			$editLink.attr('href', ProcessWire.config.urls.admin + 'setup/field/edit?id=' + fieldId);
			$editLink.attr('class', 'ahl__link ahl__link--edit-field pw-modal pw-modal-medium');
			$editLink.attr('data-buttons', '#Inputfield_submit_save_field');
			$editLink.attr('data-autoclose', "");

			$editLink.append("<div class='ahl__keep-height'>&nbsp;</div>");
			$editLink.append("<i class='fa fa-cube'></i>");

			$tooltipWrapper = $("<span>");
 			$tooltipWrapper.attr('title', 'Edit field');
			$tooltipWrapper.attr('uk-tooltip', "");
			$tooltipWrapper.append($editLink);

			$links.append($tooltipWrapper);

			var templateName = getPageTemplateName();
			var templateFieldgroupId = ProcessWire.config.AdminHelperLinks.templateFieldgroupIds[templateName];
			if (templateFieldgroupId) {
				var $editInContextLink = $("<a>");
				$editInContextLink.attr('href', ProcessWire.config.urls.admin + 'setup/field/edit?id=' + fieldId + '&fieldgroup_id=' + templateFieldgroupId + '&process_template=1');
				$editInContextLink.attr('class', 'ahl__link ahl__link--edit-field-in-context pw-modal pw-modal-medium');
				$editInContextLink.attr('data-buttons', '#Inputfield_submit_save_field');
				$editInContextLink.attr('data-autoclose', "");

				$editInContextLink.append("<div class='ahl__keep-height'>&nbsp;</div>");
				$editInContextLink.append("<i class='fa fa-cubes'></i>");

				$tooltipWrapper = $("<span>");
				$tooltipWrapper.attr('title', 'Edit field in template context');
				$tooltipWrapper.attr('uk-tooltip', "");
				$tooltipWrapper.append($editInContextLink);

				$hoverContent.append($tooltipWrapper);
			}

			$header.addClass('ahl--init');
		}
	});
}

function initPageTemplate() {
	var templateName = getPageTemplateName();
	var templateId = ProcessWire.config.AdminHelperLinks.templateIds[templateName];

	if (templateId) {
		var $wrapper = $('<li class="ahl__template" title="Edit template">');

		$wrapper.append('<span class="ahl__template-name" title="Template">' + templateName + '</span>');

		$link = $('<a>');
		$link.attr('href', ProcessWire.config.urls.admin + '/setup/template/edit?id=' + templateId);
		$link.attr('class', 'ahl__link ahl__link--template pw-modal pw-modal-medium');
		$link.attr('data-buttons', '#Inputfield_submit');
		$link.attr('data-autoclose', '');
		$link.attr('uk-tooltip', 'Edit page template');

		$link.append('<i class="fa fa-cubes"></i>');

		$wrapper.append($link);

		$wrapper.find('> *:not(a)').on('click', event => event.stopPropagation());

		$('#PageEditTabs').append($wrapper);
	}
}

jQuery(document).ready(function($) {
	initPageTemplate();
	initField($('.Inputfield'));

	$(document).on('reloaded', '.Inputfield', function() {
		initField($(this));
	});
});
