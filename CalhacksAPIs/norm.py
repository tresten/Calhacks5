import numpy as np
from scipy import stats
print("hi")
data = np.array([1,2,3,4,5])
print(data)
# Fit a normal distribution to the data:
print(stats.zscore(data))