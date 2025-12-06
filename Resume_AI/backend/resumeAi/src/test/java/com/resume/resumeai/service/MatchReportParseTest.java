package com.resume.resumeai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MatchReportParseTest {
    @Test
    void parseCamelCaseJson() throws Exception {
        String json = "{\n  \"overallScore\": 58,\n  \"skillMatch\": 40,\n  \"experienceRelevance\": 65,\n  \"cultureFit\": 70,\n  \"analysis\": \"ok\",\n  \"suggestions\": [\"a\"],\n  \"missingKeywords\": [\"x\"]\n}";
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json);
        assertNotNull(root.get("overallScore"));
        assertEquals(58, root.get("overallScore").intValue());
        assertTrue(root.get("suggestions").isArray());
    }
}
