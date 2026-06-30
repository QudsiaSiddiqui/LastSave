package com.lastsave.controller;

import java.util.List;

public class PhoenixResponse {
    private List<PivotPath> paths;

    public PhoenixResponse() {
    }

    public PhoenixResponse(List<PivotPath> paths) {
        this.paths = paths;
    }

    public List<PivotPath> getPaths() {
        return paths;
    }
}
