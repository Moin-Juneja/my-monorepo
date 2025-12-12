export default {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "tsconfig.app.json"   // 👈 VERY IMPORTANT
        }]
    },
    moduleNameMapper: {
        "\\.(css|scss|sass)$": "identity-obj-proxy"   // ⬅ FIX CSS IMPORTS
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"]
};
