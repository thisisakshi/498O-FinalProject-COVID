import numpy as np
import pandas as pd
from scipy.stats import pearsonr
from scipy.stats import spearmanr 

#read in data
healthGDP = pd.read_json('data/healthdata.json')
covidDeaths1 = pd.read_json('data/timeseries.json') # for use with healthGDP
covidDeaths2 = pd.read_json('data/timeseries.json') # for use with hospital beds
hospitalBeds = pd.read_csv('data/owid-covid-data.csv')

# drop na values for 2017 data
healthGDP = healthGDP.dropna(subset=['2017'])

# drop na values for hospital beds data
hospitalBeds = hospitalBeds.dropna(subset=['hospital_beds_per_100k'])

# get latest date (atm 5/13)
hospitalBeds = hospitalBeds.loc[hospitalBeds['date'] == '2020-05-13']

# get common countries for gdp and deaths (155 common)
healthCountries = healthGDP['Country']
covidCountries = covidDeaths1.columns
common1 = pd.Series(list(set(healthCountries) & set(covidCountries)))

# get common countries for hospital beds and deaths (156 common)
hospitalCountries = hospitalBeds['location']
common2 = pd.Series(list(set(hospitalCountries) & set(covidCountries)))
#print(common2)

# filter healthGDP, covidDeaths1 to get only common countries
healthGDP = healthGDP[healthGDP['Country'].isin(common1)]
covidDeaths1 = covidDeaths1[common1]

# filter hospitalBeds, covidDeaths2 to get common countries
hospitalBeds = hospitalBeds[hospitalBeds['location'].isin(common2)]
covidDeaths2 = covidDeaths2[common2]

# sort rows and columns so countries matching
healthGDP = healthGDP.sort_values(by=['Country'])
covidDeaths1 = covidDeaths1.reindex(healthGDP['Country'], axis=1)

hospitalBeds = hospitalBeds.sort_values(by=['location'])
covidDeaths2 = covidDeaths2.reindex(hospitalBeds['location'], axis=1)
#print(hospitalBeds)
#print(covidDeaths2)

# extract variables for 2017 gdp and latest deaths according to dataset (atm 5/13)
gdp = healthGDP['2017']
beds = hospitalBeds['hospital_beds_per_100k']
deaths1 = []
deaths2 = []

for country in covidDeaths1.iloc[-1]:
	#print(country['deaths'])
	deaths1.append(country['deaths'])

for country in covidDeaths2.iloc[-1]:
	deaths2.append(country['deaths'])

# print(beds)
# print(deaths2)

# calculate Pearson's and Spearman's Correlation Coefficients
print('Deaths vs Health GDP')
p_corr1, _ = pearsonr(deaths1, gdp)
s_corr1, _ = spearmanr(deaths1, gdp)
print('Pearsons correlation: %.3f' % p_corr1)
print('Spearmans correlation: %.3f' % s_corr1)

print('Deaths vs Hospital Beds Per 100k')
p_corr2, _ = pearsonr(deaths2, beds)
s_corr2, _ = spearmanr(deaths2, beds)
print('Pearsons correlation: %.3f' % p_corr2)
print('Spearmans correlation: %.3f' % s_corr2)
