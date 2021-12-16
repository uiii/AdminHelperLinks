<?php namespace ProcessWire;

class AdminHelperLinks extends WireData implements Module {

	public static function getModuleInfo() {
		return array(
			'title' => 'Admin Helper Links',
			'version' => 100,
			'summary' => 'Adds field edit links to input fields on page edit.',
			'singular' => true,
			'autoload' => true,
			'permission' => 'admin-helper-links',
			'permissions' => array(
				'admin-helper-links' => 'Enable Admin Helper Links module'
			),
			'requires' => array(
 				'ProcessWire>=3.0'
			)
		);
	}

	public function init() {
		$this->modules->loadModuleFileAssets($this);
	}
}
