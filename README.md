# Formula One Driver Dashboard

## Dataset Reference
The dataset was downloaded from Kaggle: [F1 Drivers dataset](https://www.kaggle.com/datasets/petalme/f1-drivers-dataset/data), with a license of [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). <br>

**[Formula 1 (F1) Overview](https://www.formula1.com/en/latest/article/the-beginners-guide-to-the-f1-drivers-championship.53MjXJzTDxQnfxfoCLnxNZ)**: Each Formula 1 season spans a year and consists of approximately 20 to 30 races held in different locations worldwide. Each race determines a winner (1st place finisher) and the podium finishers (top 3 drivers: 1st, 2nd, and 3rd places). The top 10 drivers of each race earn points based on their finishing positions. At the end of the season, the driver with the highest cumulative points is the World Drivers' Champion.<br>

The dataset contains **868** F1 drivers' name (primary key), nationality and race statistics. We will use the data to explore the correlation between race statistics (e.g. number of pole positions, number of winner, etc.) and the world champion result (yes or no).

## Visualization Plan
- Control Panel (or filter):
    - Decades (slide bar)
    - Number of race entries (slide bar)
- **Bar Chart**: Drivers with Top 10 race wins
- **Scatter Plot:** PCA Component 1 and 2, color-coded by championship results, hoping to find clusters
- **Global Map**: Color coded by Number of Drivers in that Continent, and use circle sizes to show number of world champions
- **Parallel Coordinate Graph**: with the following coordinates
    - Number of Pole Positions
    - Number of Podiums
    - Number of Fastest Laps
    - Number of Points
    - Yes/No World Champion
- Hidden Information Panel (if possible): to introduce Formula 1 race, the meaning of the columns, and summary statistics of the dataset
