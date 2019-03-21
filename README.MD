# binox-solver

This is a basic (under 1000 lines of code, with tests) solver for the [https://krazydad.com/binox/](https://krazydad.com/binox/) game. You can use it to take boards in and get a completed solution out of it. The features are pretty basic right now but for now you can...

* Specify strings as binary strings and get results
* Pass in entire half-completed boards and get solutions out
* It's fast -- you can solve most boards in under 4ms if the tests are anything to go by (there's room for improvement); measured on a Core i5 2500 @ 3.3Ghz
* Log out the steps to get solutions

This is a module only. You can use it for your own games or applications. If you are looking for tools that use this tool / just looking to solve a problem, you can consider checking out the [Binox Interactive Solver](https://github.com/hilts-vaughan/binox-interactive-solver).

If you want to know how the solver algorithm works, you can read a post on my [blog](https://vaughanhilts.me/blog/2019/03/07/writing-a-binox-solver.html). 