'''
dimension reduction using pca
'''
from sklearn import decomposition
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler

df = pd.read_csv("../F1_driver_dataset.csv")
features = ["Pole_Rate","Start_Rate","Win_Rate","Podium_Rate","FastLap_Rate","Points_Per_Entry", "Years_Active"]
target = ["Champion"]
ind = ["Driver"]

# data norm for features
scaler = MinMaxScaler()
df[features] = scaler.fit_transform(df[features])

pca = decomposition.PCA(n_components=2)
embeddings_pca = pd.DataFrame(
    pca.fit_transform(df[features]),
    columns=['PC0', 'PC1']
)
embeddings_pca["champion"] = df[target]
embeddings_pca["driver"] = df[ind]

print(embeddings_pca.head())

# overview of the scatter plot
plt.figure(figsize=(10, 6))
scatter = plt.scatter(embeddings_pca['PC0'], embeddings_pca['PC1'], c=embeddings_pca['champion'], cmap='coolwarm')

# Add labels and title
plt.title("PCA of F1 Driver Performance (Colored by Champion Status)")
plt.xlabel("Principal Component 0")
plt.ylabel("Principal Component 1")
plt.colorbar(scatter, label="Champion Status (0: Non-Champion, 1: Champion)")

# Show the plot
plt.show()

# sns.pairplot(df[features+ ['Champion']], hue="Champion")
# plt.show()