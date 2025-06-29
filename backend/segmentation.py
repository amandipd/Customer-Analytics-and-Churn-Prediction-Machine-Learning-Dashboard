import pandas as pd
from sklearn.cluster import KMeans, DBSCAN
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns  # data viz library
from mpl_toolkits.mplot3d import Axes3D  # for 3D plotting


class Segmentation:

    def __init__(self, df):
        self.df = df

    def dbscan(self):
        X, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.5)

        dbscan = DBSCAN(eps=0.3, min_samples=5)
        labels = dbscan.fit_predict(X)

        plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis')
        plt.show()

    def k_means_cluster(self, features, n_clusters=3, plot=True):
        """
        K-Means clusters are formed by partitioning data into k groups based on similarity
        """

        """
        K-Means Segmentation Intuition:
        --------------------------------
        K-Means is an unsupervised machine learning algorithm used to group data points into a specified number (k) of clusters based on feature similarity.

        - The algorithm randomly initializes k cluster centers (centroids).
        - Each data point is assigned to the nearest centroid, forming clusters.
        - The centroids are then recalculated as the mean of all points assigned to each cluster.
        - This process repeats: points are reassigned and centroids are updated until assignments no longer change or a maximum number of iterations is reached.

        The result is that each data point belongs to the cluster with the nearest mean, and the clusters are as compact and well-separated as possible given the data and chosen features.

        In this implementation, the most relevant features for visualization are automatically selected based on the variance of cluster centers, highlighting the features that best separate the clusters.
        """
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

    def dbscan_cluster(self, features, eps=0.5, min_samples=5, plot=True):
        """
        Perform DBSCAN clustering on the selected features.

        Parameters:
        -----------
        features : list of str
            List of column names from the DataFrame to use for clustering.
        eps : float, optional (default=0.5)
            The maximum distance between two samples for one to be considered as in the neighborhood of the other.
        min_samples : int, optional (default=5)
            The number of samples (or total weight) in a neighborhood for a point to be considered as a core point.
        plot : bool, optional (default=True)
            If True, automatically plots the clusters using the most relevant features (highest variance).

        Returns:
        --------
        df_with_clusters : pandas.DataFrame
            A copy of the original DataFrame with an added 'Cluster' column indicating the DBSCAN cluster assignment for each row.

        Notes:
        ------
        - DBSCAN (Density-Based Spatial Clustering of Applications with Noise) is an unsupervised clustering algorithm that groups together points that are closely packed together, marking as outliers points that lie alone in low-density regions.
        - This method automatically selects the most relevant features for visualization based on variance, and creates a 2D or 3D scatter plot of the clusters.
        - Cluster label -1 indicates noise points (outliers) detected by DBSCAN.
        """
        X = self.df[features].values
        dbscan = DBSCAN(eps=eps, min_samples=min_samples)
        cluster_labels = dbscan.fit_predict(X)

        df_with_clusters = self.df.copy()
        df_with_clusters['Cluster'] = cluster_labels

        # Automatically select most relevant features (highest variance)
        variances = X.var(axis=0)
        feature_variance = list(zip(features, variances))
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
                plt.title("DBSCAN Clustering (3D)")
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
                plt.title("DBSCAN Clustering (2D)")
                plt.xlabel(top2[0])
                plt.ylabel(top2[1])
                plt.show()

        return df_with_clusters
