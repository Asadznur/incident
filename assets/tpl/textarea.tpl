<fieldset>
	<div ng-repeat="entry in state.log.entries" ng-if="element.name === 'timeline' && state.log.entries.length > 0" class="entry">{{entry.date}} - {{entry.text}}</div>
    <label for="{{element.name}}">{{element.label}}</label>
    <textarea name="{{element.name}}"
              id="{{element.name}}"
              ng-model="state[element.name]"
              ng-click="tip=true"
              ng-blur="tip=false"
              placeholder="{{element.placeholder}}"
              ng-disabled="(include.status === 'disabled') ? include.status : ''"
              ng-required="(include.status === 'required') ? include.status : ''">{{element.value}}</textarea>
    <div class="errors-wrapper" ng-include="'build/tpl/error.tpl'"></div>
    <div class="tips-wrapper" ng-include="'build/tpl/tip.tpl'"></div>
</fieldset>
