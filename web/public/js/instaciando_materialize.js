  // SIDEBAR
document.addEventListener('DOMContentLoaded', function() {


  $(document).ready(function(){
    $('.sidenav').sidenav();
  });

 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
})