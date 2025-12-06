package com.resume.resumeai.domain.dto.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ResumePolishResponseTest {
    @Test
    void serializeWithoutSuggestions() throws Exception {
        ResumePolishResponse r = new ResumePolishResponse();
        r.setPolishedText("hello");
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(r);
        assertTrue(json.contains("polishedText"));
        assertFalse(json.contains("suggestions"));
    }
}
