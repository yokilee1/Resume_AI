package com.resume.resumeai.api;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.CrawlerTask;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.domain.User;
import com.resume.resumeai.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "管理员后台接口")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    public AdminController(AdminService adminService) { this.adminService = adminService; }

    @GetMapping("/stats")
    @Operation(summary = "仪表盘统计", description = "获取用户总数、简历总数及活跃度")
    public ApiResponse<Map<String, Object>> getStats() {
        return ApiResponse.ok(adminService.getStats());
    }

    @GetMapping("/users")
    @Operation(summary = "用户列表", description = "分页获取用户列表")
    public ApiResponse<List<User>> listUsers(@RequestParam(defaultValue="1") int page,
                                             @RequestParam(defaultValue="20") int pageSize) {
        return ApiResponse.ok(adminService.listUsers(page, pageSize));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "更新用户角色", description = "设置用户为 Admin 或 User")
    public ApiResponse<Boolean> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (role == null) return ApiResponse.error("INVALID_ARGUMENT", "Role is required");
        adminService.updateUserRole(id, role);
        return ApiResponse.ok(true);
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "更新用户状态", description = "设置用户为 Active 或 Inactive")
    public ApiResponse<Boolean> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) return ApiResponse.error("INVALID_ARGUMENT", "Status is required");
        adminService.updateUserStatus(id, status);
        return ApiResponse.ok(true);
    }

    @GetMapping("/jobs")
    @Operation(summary = "职位列表", description = "获取所有职位列表（分页）")
    public ApiResponse<Map<String, Object>> listJobs(@RequestParam(defaultValue="1") int page,
                                                   @RequestParam(defaultValue="20") int pageSize) {
        return ApiResponse.ok(adminService.listJobs(page, pageSize));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "删除职位", description = "删除指定 ID 的职位")
    public ApiResponse<Boolean> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ApiResponse.ok(true);
    }

    @GetMapping("/crawler/tasks")
    @Operation(summary = "爬虫任务列表", description = "获取所有定时爬虫任务")
    public ApiResponse<List<CrawlerTask>> listCrawlerTasks() {
        return ApiResponse.ok(adminService.listCrawlerTasks());
    }

    @PostMapping("/crawler/tasks")
    @Operation(summary = "创建爬虫任务", description = "新建一个爬虫调度任务")
    public ApiResponse<CrawlerTask> createCrawlerTask(@RequestBody CrawlerTask task) {
        return ApiResponse.ok(adminService.createCrawlerTask(task));
    }

    @DeleteMapping("/crawler/tasks/{id}")
    @Operation(summary = "删除爬虫任务", description = "移除一个爬虫调度任务")
    public ApiResponse<Boolean> deleteCrawlerTask(@PathVariable String id) {
        adminService.deleteCrawlerTask(id);
        return ApiResponse.ok(true);
    }

    @PatchMapping("/crawler/tasks/{id}/status")
    @Operation(summary = "更新爬虫任务状态", description = "暂停或恢复爬虫任务")
    public ApiResponse<Boolean> updateCrawlerTaskStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) return ApiResponse.error("INVALID_ARGUMENT", "Status is required");
        adminService.updateCrawlerTaskStatus(id, status);
        return ApiResponse.ok(true);
    }

    @PatchMapping("/templates/{id}/status")
    @Operation(summary = "更新模板状态", description = "启用或禁用模板")
    public ApiResponse<Boolean> updateTemplateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) return ApiResponse.error("INVALID_ARGUMENT", "Status is required");
        adminService.updateTemplateStatus(id, status);
        return ApiResponse.ok(true);
    }

    @PostMapping("/users")
    @Operation(summary = "创建用户", description = "新建一个系统用户")
    public ApiResponse<Boolean> createUser(@RequestBody User user) {
        adminService.createUser(user);
        return ApiResponse.ok(true);
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "删除用户", description = "移除一个系统用户")
    public ApiResponse<Boolean> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ApiResponse.ok(true);
    }

    @PostMapping("/templates")
    @Operation(summary = "创建模板", description = "上传一个新的简历模板")
    public ApiResponse<Boolean> createTemplate(@RequestBody com.resume.resumeai.domain.Template template) {
        adminService.createTemplate(template);
        return ApiResponse.ok(true);
    }

    @DeleteMapping("/templates/{id}")
    @Operation(summary = "删除模板", description = "移除一个简历模板")
    public ApiResponse<Boolean> deleteTemplate(@PathVariable Long id) {
        adminService.deleteTemplate(id);
        return ApiResponse.ok(true);
    }
}
