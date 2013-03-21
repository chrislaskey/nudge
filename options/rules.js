/* -------------------------------------------------------------------------- */

var RulesFormParser = function(){
	'use strict';

	var parseForm = function(form){
		var rules = [],
			current_rule,
			current_value,
			current_name;

		form.find('.rule').each(function(){
			current_rule = {};
			$(this).find('input').each(function(){
				current_name = $(this).attr('name');
				current_value = $(this).val();
				current_rule[current_name] = current_value;
			});
			rules.push(current_rule);
		});
		return rules;
	};

	return {
		parse: function(form){
			return parseForm(form);
		}
	};
};

/* -------------------------------------------------------------------------- */

var RulesFormBinder = function(){
	'use strict';

	var form;

	var bindSave = function(){
		form.on('click', function(){
			var rules = new RulesFormParser().parse(form);
		});
	};

	var bindAdd = function(){
		form.find('.add-rule').on('click', function(e){
			var html_rule_creator = new HtmlRuleCreator();
			html_rule_creator.attachRule();
			e.preventDefault();
		});
	};

	return {
		init: function(selector){
			form = $(selector);
			bindSave();
			bindAdd();
		}
	};
};

/* -------------------------------------------------------------------------- */

var HtmlRuleCreator = function(){
	'use strict';

	var values = {},
		rules_container = $('.rules-list'),
		utilities = new Utilities();

	var attachRuleHtml = function(){
		var pattern = returnPatternHtml(),
			visit_limit = returnVisitLimitHtml(),
			grace_period = returnGracePeriodHtml(),
			cooldown_period = returnCooldownPeriodHtml(),
			remove_button = returnRemoveButtonHtml(),
			container = $('<li class="rule" />');
		container.append(pattern);
		container.append("\n");
		container.append(visit_limit);
		container.append("\n");
		container.append(grace_period);
		container.append("\n");
		container.append(cooldown_period);
		container.append("\n");
		container.append(remove_button);
		rules_container.append(container);
	};

	var returnPatternHtml = function(){
		var value = returnValue('pattern');
		return $('<input name="pattern" placeholder="URL Pattern" type="text" value="'+value+'"/>');
	};

	var returnVisitLimitHtml = function(){
		var value = returnValue('visit_limit');
		return $('<input name="visit_limit" placeholder="Daily Visit Limit" type="text" value="'+value+'"/>');
	};

	var returnGracePeriodHtml = function(){
		var value = returnValue('grace_period');
		return $('<input name="grace_period" placeholder="Grace Period" type="text" value="'+value+'"/>');
	};

	var returnCooldownPeriodHtml = function(){
		var value = returnValue('cooldown_period');
		return $('<input name="cooldown_period" placeholder="Cooldown Period" type="text" value=""'+value+'/>');
	};

	var returnRemoveButtonHtml = function(){
		var remove_button_html = $('<button class="remove-rule" name="remove-rule">Remove Rule</button>');
		remove_button_html.on('click', function(e){
			$(this).parent().remove();
			e.preventDefault();
		});
		return remove_button_html;
	};

	var returnValue = function(key){
		if( utilities.object.hasProperty(values, key) ){
			return values[key];
		}else{
			return '';
		}
	};

	return {
		setValues: function(rule_values){
			values = rule_values;
		},
		attachRule: function(){
			attachRuleHtml();
		}
	};
};

/* -------------------------------------------------------------------------- */

$(function(){
	'use strict';

	new RulesFormBinder().init('.rules-form');

	//TODO: move into init class 
	var html_rule_creator = new HtmlRuleCreator();
	html_rule_creator.setValues({});
	html_rule_creator.attachRule();
});

/* -------------------------------------------------------------------------- */
