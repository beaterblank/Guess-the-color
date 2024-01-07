# Guess-the-color
## Overview
Welcome to our machine-learning project dedicated to exploring color perception! You can participate in the interactive game [here](https://beaterblank.github.io/Guess-the-color/).

## Approach
In our game set within a 5 by 5 grid, the distribution features `color 1` appearing 24 times, while `color 2` is presented once. The primary objective of the game is for participants to identify and locate the unique occurrence of `color 2`.

The selection process of these colors commences with the random assignment of `color 1`. Subsequently, we apply a specialized approach to determine the placement of `color 2`. This involves sampling a delta value from a customized Gaussian probability distribution using an adjusted Box-Muller transformation, with the formula:

![image](https://github.com/beaterblank/Guess-the-color/assets/68276845/85b0d3b8-4bea-4e2d-9ce1-ad94353619dd)

where `U_1` and `U_2` represent uniform random variables. The resulting value undergoes scaling by a factor of 2, providing a balanced level of difficulty. we generate deltaR, detlaG, deltaB and add it to `color 1`

![probability distribution of our transform](https://github.com/beaterblank/Guess-the-color/assets/68276845/656d3263-4ae4-45ba-96e4-b6d319200331)

The game's objective is for participants to discern the unique occurrence of `color 2` amidst the more frequent appearance of `color 1`. Players are encouraged to leverage their color perception skills to successfully locate and identify `color 2` in the 5 by 5 grid.

## Limitations
It's important to note that the data collected relies on the diverse perspectives of individual participants. Each source of data is evaluated independently, and the results may be influenced by the subjective nature of color perception.n
