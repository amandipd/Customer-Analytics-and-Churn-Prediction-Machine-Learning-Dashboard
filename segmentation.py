import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns # data viz library

class Segmentation:

    def __init__(self, df):
        self.df = df

    def k_means_cluster(df, features, n_clusters=3, plot=True):
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(scaled_data)
