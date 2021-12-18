<?php namespace ProcessWire;

class AdminHelperLinks extends WireData implements Module {

	public static function getModuleInfo() {
		return array(
			'title' => 'Admin Helper Links',
			'version' => 111,
			'summary' => "Shortcut links to edit fields and template directly from page edit.",
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
		$this->modules->JqueryUI->use('modal');
		$this->modules->loadModuleFileAssets($this);

		$this->config->js($this->className, [
			'fieldIds' => array_reduce(array_values($this->fields->getAll()->getArray()), function ($fields, $f) { return $fields + [$f->name => $f->id]; }, []),
			'templateIds' => array_reduce(array_values($this->templates->getAll()->getArray()), function ($templates, $t) { return $templates + [$t->name => $t->id]; }, []),
			'templateFieldgroupIds' => array_reduce(array_values($this->templates->getAll()->getArray()), function ($templates, $t) { return $templates + [$t->name => $t->fieldgroup->id]; }, [])
		]);
	}
}
