function getPageTemplateName() {
	var $pageEditProcess = $('#ProcessPageEdit');

	if (!$pageEditProcess.length) {
		return;
	}

	var templateClass = $pageEditProcess.attr('class').split(/\s+/).find(c => c.startsWith('template_'));
	var templateName = templateClass && templateClass.replace(/^template_/, '');

	return templateName;
}

function getFieldName($inputfield) {
	var $label = $inputfield.find('label.InputfieldHeader');

	if ($label.length == 0) {
		return undefined;
	}

	var forId = $label.attr('for');
	if(!forId) forId = $inputfield.attr('id');
	if(!forId) return undefined;

	var fieldName = forId
		.replace(/^Inputfield_|wrap_Inputfield_|wrap_/, '')
		.replace(/_repeater.*$/, '');

	return fieldName;
}

function getFieldTemplateName($inputfield) {
	$repeater = $inputfield.parent().closest('.InputfieldRepeater');

	if ($repeater.length > 0) {
		return 'repeater_' + getFieldName($repeater);
	}

	return getPageTemplateName();
}

function initField() {
	var $inputfield = $(this);

	if ($inputfield.hasClass('ahl--init')) {
		return;
	}

	$toggleIcon = $inputfield.find('> .InputfieldHeader > i.toggle-icon');

	if (!$toggleIcon) {
		return;
	}

	$toggleIcon.off('hover');

	var fieldName = getFieldName($inputfield);
	var fieldId = ProcessWire.config.AdminHelperLinks.fieldIds[fieldName];

	if (fieldId) {
		var $links = $("<div class='ahl' title=''>");
		$toggleIcon.append($links);

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

		var $editLink = $("<a>");
		$editLink.attr('href', ProcessWire.config.urls.admin + 'setup/field/edit?id=' + fieldId);
		$editLink.attr('class', 'ahl__link ahl__link--edit-field pw-modal pw-modal-medium');
		$editLink.attr('tabindex', '-1');
		$editLink.attr('data-buttons', '#Inputfield_submit_save_field');
		$editLink.attr('data-autoclose', "");

		$editLink.append("<div class='ahl__keep-height'>&nbsp;</div>");
		$editLink.append("<i class='fa fa-cube'></i>");

		$tooltipWrapper = $("<span>");
		$tooltipWrapper.attr('title', 'Edit field');
		$tooltipWrapper.attr('uk-tooltip', "");
		$tooltipWrapper.attr('tabindex', '-1');
		$tooltipWrapper.append($editLink);

		$links.append($tooltipWrapper);

		var templateName = getFieldTemplateName($inputfield);
		var templateFieldgroupId = ProcessWire.config.AdminHelperLinks.templateFieldgroupIds[templateName];

		if (templateFieldgroupId) {
			var $editInContextLink = $("<a>");
			$editInContextLink.attr('href', ProcessWire.config.urls.admin + 'setup/field/edit?id=' + fieldId + '&fieldgroup_id=' + templateFieldgroupId + '&process_template=1');
			$editInContextLink.attr('class', 'ahl__link ahl__link--edit-field-in-context pw-modal pw-modal-medium');
			$editInContextLink.attr('tabindex', '-1');
			$editInContextLink.attr('data-buttons', '#Inputfield_submit_save_field');
			$editInContextLink.attr('data-autoclose', "");

			$editInContextLink.append("<div class='ahl__keep-height'>&nbsp;</div>");
			$editInContextLink.append("<i class='fa fa-cubes'></i>");

			$tooltipWrapper = $("<span>");
			$tooltipWrapper.attr('title', 'Edit field in template context');
			$tooltipWrapper.attr('uk-tooltip', "");
			$tooltipWrapper.attr('tabindex', '-1');
			$tooltipWrapper.append($editInContextLink);

			$hoverContent.append($tooltipWrapper);
		}
	}

	$inputfield.addClass('ahl--init');
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
	$('.Inputfield').each(initField);

	$(document).on('reloaded', '.Inputfield', function() {
		$(this).each(initField);
	});
});
