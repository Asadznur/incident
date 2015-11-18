<fieldset>
    <label for="{{element.name}}">{{element.label}}</label>
    <select name="{{element.name}}"
            id="{{element.name}}"
            ng-model="state[element.name]"
            ng-options="option for option in element.options"
            ng-click="tip=true"
            ng-blur="tip=false"
            ng-disabled="(include.status === 'disabled') ? include.status : ''"
            ng-required="(include.status === 'required') ? include.status : ''">
    </select>
    <div class="errors-wrapper" ng-include="'build/tpl/error.tpl'"></div>
    <div class="tips-wrapper" ng-include="'build/tpl/tip.tpl'"></div>
</fieldset>
