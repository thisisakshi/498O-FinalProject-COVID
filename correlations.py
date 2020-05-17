import numpy as np
import pandas as pd
from scipy.stats import pearsonr
from scipy.stats import spearmanr 

#read in data
covidDeaths1 = pd.read_json('data/timeseries.json') # for use with healthGDP
covidDeaths2 = pd.read_json('data/timeseries.json') # for use with hospital beds
confirmedData = pd.read_json('data/timeseries.json') # for use with handwashing stations
healthGDP = pd.read_json('data/healthdata.json')
hospitalBeds = pd.read_csv('data/owid-covid-data.csv')
handwashingStns = pd.read_csv('data/owid-covid-data.csv')

# drop na values for 2017 data
healthGDP = healthGDP.dropna(subset=['2017'])

# drop na values for hospital beds data
hospitalBeds = hospitalBeds.dropna(subset=['hospital_beds_per_100k'])

# drop na values for handwashingStns (6727 rows)
handwashingStns = handwashingStns.dropna(subset=['handwashing_facilities']) 

# get latest date (atm 5/13) for hospital beds
hospitalBeds = hospitalBeds.loc[hospitalBeds['date'] == '2020-05-13']

# get latest date (atm 5/13) for handwashing stations (91 rows)
handwashingStns = handwashingStns.loc[handwashingStns['date'] == '2020-05-13']

# get common countries for gdp and deaths (155 common)
healthCountries = healthGDP['Country']
covidCountries1 = covidDeaths1.columns
common1 = pd.Series(list(set(healthCountries) & set(covidCountries1)))

# get common countries for hospital beds and deaths (156 common)
hospitalCountries = hospitalBeds['location']
covidCountries2 = covidDeaths2.columns
common2 = pd.Series(list(set(hospitalCountries) & set(covidCountries2)))
#print(common2)

# get common countries for handwashing and confirmedData  (85 common)
confirmedCountries = confirmedData.columns
handwashingCountries = handwashingStns['location']
common3 = pd.Series(list(set(handwashingCountries) & set(confirmedCountries)))
#print(common3)

# filter healthGDP, covidDeaths1 to get only common countries
healthGDP = healthGDP[healthGDP['Country'].isin(common1)]
covidDeaths1 = covidDeaths1[common1]

# filter hospitalBeds, covidDeaths2 to get common countries
hospitalBeds = hospitalBeds[hospitalBeds['location'].isin(common2)]
covidDeaths2 = covidDeaths2[common2]

# filter handwashingStns, confirmed to get common countries
handwashingStns = handwashingStns[handwashingStns['location'].isin(common3)]
confirmedData = confirmedData[common3]
#print(handwashingStns)
#print(confirmedData)

# sort rows and columns so countries matching
healthGDP = healthGDP.sort_values(by=['Country'])
covidDeaths1 = covidDeaths1.reindex(healthGDP['Country'], axis=1)

hospitalBeds = hospitalBeds.sort_values(by=['location'])
covidDeaths2 = covidDeaths2.reindex(hospitalBeds['location'], axis=1)

handwashingStns = handwashingStns.sort_values(by=['location'])
confirmedData = confirmedData.reindex(handwashingStns['location'], axis=1)

#print(handwashingStns)
#print(confirmedData)


# extract variables for 2017 gdp and latest deaths according to dataset (atm 5/13)
gdp = healthGDP['2017']
beds = hospitalBeds['hospital_beds_per_100k']
stns = handwashingStns['handwashing_facilities']
deaths1 = []
deaths2 = []
confirmed = []

# no need to drop, deaths all over 0 for both 
for country in covidDeaths1.iloc[-1]:
	deaths1.append(country['deaths'])

for country in covidDeaths2.iloc[-1]:
	deaths2.append(country['deaths'])

for country in confirmedData.iloc[-1]:
	confirmed.append(country['confirmed'])



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

print('Confirmed vs Handwashing Facilities')
p_corr3, _ = pearsonr(confirmed, stns)
s_corr3, _ = spearmanr(confirmed, stns)
print('Pearsons correlation: %.3f' % p_corr3)
print('Spearmans correlation: %.3f' % s_corr3)
