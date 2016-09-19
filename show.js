var b=2
a=function() {
  var b=3
  var c=function () {
    // console.log(b)
    return b
  }
  return c
}
a()()
console.log(a()())
console.log(b)
