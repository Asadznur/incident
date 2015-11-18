<fieldset>
    <input type="checkbox"
    	   name="{{element.name}}"
    	   ng-model="state[element.name]"> <span>{{element.label}}</span>
    <div class="errors-wrapper" ng-include="'build/tpl/error.tpl'"></div>
    <div class="tips-wrapper" ng-include="'build/tpl/tip.tpl'"></div>
</fieldset>
