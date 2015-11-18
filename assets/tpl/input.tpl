<fieldset>
    <label for="{{element.name}}">{{element.label}}</label>
    <input tyep="text"
    	   name="{{element.name}}"
           id="{{element.name}}"
           ng-model="state[element.name]"
           ng-click="tip=true"
           ng-blur="tip=false"
           ng-minlength="2"
           placeholder="{{element.placeholder}}"
           ng-disabled="(include.status === 'disabled') ? include.status : ''"
           ng-required="(include.status === 'required') ? include.status : ''">
    <div class="errors-wrapper" ng-include="'build/tpl/error.tpl'"></div>
    <div class="tips-wrapper" ng-include="'build/tpl/tip.tpl'"></div>
</fieldset>
