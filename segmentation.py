import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns  # data viz library
from mpl_toolkits.mplot3d import Axes3D  # for 3D plotting


class Segmentation:

    def __init__(self, df):
        self.df = df

    def k_means_cluster(self, features, n_clusters=3, plot=True):
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(self.df[features])

        # create copy of original dataframe with cluster assignments
        df_with_clusters = self.df.copy()
        df_with_clusters['Cluster'] = cluster_labels

        # Automatically select most relevant features (highest variance in cluster centers)
        centers = kmeans.cluster_centers_
        variances = centers.var(axis=0)
        feature_variance = list(zip(features, variances))

        # Sort features by variance descending
        feature_variance.sort(key=lambda x: x[1], reverse=True)

        if plot:
            if len(features) >= 3:
                top3 = [fv[0] for fv in feature_variance[:3]]
                fig = plt.figure(figsize=(10, 7))
                ax = fig.add_subplot(111, projection='3d')
                scatter = ax.scatter(
                    df_with_clusters[top3[0]],
                    df_with_clusters[top3[1]],
                    df_with_clusters[top3[2]],
                    c=df_with_clusters['Cluster'],
                    cmap='Set2',
                    s=60
                )
                ax.set_xlabel(top3[0])
                ax.set_ylabel(top3[1])
                ax.set_zlabel(top3[2])
                plt.title("K-Means Clustering (3D)")
                plt.legend(*scatter.legend_elements(), title="Cluster")
                plt.show()
            elif len(features) >= 2:
                top2 = [fv[0] for fv in feature_variance[:2]]
                plt.figure(figsize=(8, 5))
                sns.scatterplot(
                    data=df_with_clusters,
                    x=top2[0], y=top2[1],
                    hue='Cluster', palette='Set2', s=100
                )
                plt.title("K-Means Clustering (2D)")
                plt.xlabel(top2[0])
                plt.ylabel(top2[1])
                plt.show()

        return df_with_clusters
