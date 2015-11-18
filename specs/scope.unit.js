describe('IncidentController', function()
{
  var $controller, $scope = {};

  $scope = {
    state: {
      timeline: '',
    },
    incident: {
      $error: [],
    }
  };

  beforeEach(module('incidentTool'));

  beforeEach(inject(function(_$controller_)
  {
    $controller = _$controller_('IncidentController', { $scope: $scope });
  }));

  describe('$scope.elements', function()
  {
    it('should be an Object', function()
    {
      expect($scope.elements instanceof Object).toEqual(true);
    });
  });

  describe('$scope.object', function()
  {
    it('should be a Function', function()
    {
      expect($scope.object instanceof Function).toEqual(true);
    });
  });

  describe('$scope.state', function()
  {
    it('should be an Object', function()
    {
      expect($scope.state instanceof Object).toEqual(true);
    });
  });

  describe('$scope.data', function()
  {
    it('should be an Array', function()
    {
      expect($scope.data instanceof Array).toEqual(true);
    });
  });

  describe('$scope.params', function()
  {
    it('should be an Object', function()
    {
      expect($scope.params instanceof Object).toEqual(true);
    });
  });

  describe('$scope.reload', function()
  {
    it('should be a Function', function()
    {
      expect($scope.reload instanceof Function).toEqual(true);
    });
  });

  describe('$scope.submit', function()
  {
    it('should be a Function', function()
    {
      expect($scope.submit instanceof Function).toEqual(true);
    });
  });

  describe('$scope.insert', function()
  {
    it('should be a Function', function()
    {
      expect($scope.insert instanceof Function).toEqual(true);
    });
  });

  describe('$scope.fetch', function()
  {
    it('should be a Function', function()
    {
      expect($scope.fetch instanceof Function).toEqual(true);
    });
  });
});
