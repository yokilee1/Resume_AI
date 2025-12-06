FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ENV PORT=8080 \
    DASHSCOPE_API_KEY=""
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -fs http://localhost:${PORT}/actuator/health | grep '"status":"UP"' || exit 1
ENTRYPOINT ["java","-jar","/app/app.jar"]
