function init ($inputfield) {
	var $pageEditProcess = $('#ProcessPageEdit');

	if (!$pageEditProcess.length) {
		return;
	}

	var templateClass = $pageEditProcess.attr('class').split(/\s+/).find(c => c.startsWith('template_'));
	var templateName = templateClass && templateClass.replace(/^template_/, '');

	if (!templateName) {
		return;
	}

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
		var fieldId = ProcessWire.config.AdminHelperLinks.fieldIds[fieldName];

		$links = $("<div class='AdminHelperLinks' title=''>");
		$(this).append($links);

		$hoverContent = $("<div class='hover-content'>");
		$links.append($hoverContent);

		$backgroundFade = $("<span class='background-fade'>&nbsp;</span>");

		$links.on('hover', function () {
			$('.background-fade').css("background", "linear-gradient(to left, " + $header.css("background-color") + ", transparent)");
		})

		$hoverContent.append($backgroundFade);
		$hoverContent.append("<span class='field-name'>" + fieldName + "</span>");

		if(fieldId) {
			var $editLink = $("<a class='AdminHelperLinksLink edit-field pw-modal pw-modal-medium' data-buttons='#Inputfield_submit_save_field' data-autoclose>");
			$editLink.attr('href', ProcessWire.config.urls.admin + 'setup/field/edit?id=' + fieldId);
			$editLink.append("<div class='keep-height'>&nbsp;</div>");
			$editLink.append("<i class='fa fa-cube'></i>");

			// necessary for setting a title to link but prevent modal window to use it
			var $linkTitleWrapper = $("<span title='Edit field'></span>");
			$linkTitleWrapper.append($editLink);

			$links.append($linkTitleWrapper);

			var templateFieldgroupId = ProcessWire.config.AdminHelperLinks.templateFieldgroupIds[templateName];
			if (templateFieldgroupId) {
				var $editInContextLink = $("<a class='AdminHelperLinksLink edit-field-in-context pw-modal pw-modal-medium' data-buttons='#Inputfield_submit_save_field' data-autoclose>");
				$editInContextLink.attr('href', ProcessWire.config.urls.admin + 'setup/field/edit?id=' + fieldId + '&fieldgroup_id=' + templateFieldgroupId + '&process_template=1');
				$editInContextLink.append("<i class='fa fa-cubes'></i>");

				// necessary for setting a title to link but prevent modal window to use it
				var $linkTitleWrapper = $("<span title='Edit field in template context'></span>");
				$linkTitleWrapper.append($editInContextLink);

				$hoverContent.append($linkTitleWrapper);
			}

			$header.addClass('AdminHelperLinksInit');
		}
	});
}

jQuery(document).ready(function($) {
	console.log("HFL");

	init($('.Inputfield'));

	$(document).on('reloaded', '.Inputfield', function() {
		init($(this));
	});
});
