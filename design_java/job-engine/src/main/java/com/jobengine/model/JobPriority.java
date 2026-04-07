package com.jobengine.model;

public enum JobPriority {
    LOW(0), NORMAL(1), HIGH(2), CRITICAL(3);

    private final int weight;

    JobPriority(int weight) { this.weight = weight; }

    public int getWeight() { return weight; }
}
