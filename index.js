var button = document.getElementById("clickme"),
  count = 0;
var counter = document.getElementById("counter");
button.onclick = function() {
  count += 1;
  counter.innerHTML = "Useful Counter: " + count;
};
