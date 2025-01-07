import matplotlib.pyplot as plt
import numpy as np

def plot_performance_comparison(data):
    categories = list(data.keys())
    best_times = [data[cat]["Best"] for cat in categories]
    avg_times = [data[cat]["Average"] for cat in categories]
    worst_times = [data[cat]["Worst"] for cat in categories]

    y = np.arange(len(categories))
    width = 0.25

    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(10, 6))

    bar1 = ax.barh(y - width, best_times, width, label='Best Time', color='#1f77b4')
    bar2 = ax.barh(y, avg_times, width, label='Average Time', color='#ff7f0e')
    bar3 = ax.barh(y + width, worst_times, width, label='Worst Time', color='#d62728')

    ax.set_ylabel('Test Categories', fontsize=12)
    ax.set_xlabel('Time (ms)', fontsize=12)
    ax.set_title('Performance Comparison', fontsize=14, fontweight='bold')
    ax.set_yticks(y)
    ax.set_yticklabels(categories, fontsize=10)
    ax.legend(fontsize=10)

    for bars in [bar1, bar2, bar3]:
        for bar in bars:
            width = bar.get_width()
            ax.text(width + 0.002, bar.get_y() + bar.get_height()/2., f'{width:.6f}', ha='left', va='center', fontsize=9)

    plt.tight_layout()
    plt.show()

# Data
data = {
    "Marked": {
        "Best": 13.051808,
        "Average": 13.307879,
        "Worst": 13.779391,
    },
    "Showdown": {
        "Best": 10.165087,
        "Average": 10.423803,
        "Worst": 10.948616,
    },

    "Nanomark": {
        "Best": 0.521301,
        "Average": 0.548433,
        "Worst": 0.589241,
    },
}

plot_performance_comparison(data)

