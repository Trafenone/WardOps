using Carter;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Wards;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Wards;

public static class CreateWard
{
    public class Command : IRequest<WardResponse>
    {
        public Guid DepartmentId { get; set; }
        public Guid WardTypeId { get; set; }
        public string WardNumber { get; set; } = string.Empty;
        public WardGenderPolicy GenderPolicy { get; set; }
        public int MaxCapacity { get; set; }
        public string? Notes { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, WardResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<WardResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == request.DepartmentId, cancellationToken);
            if (department == null)
            {
                throw new KeyNotFoundException("Department not found.");
            }

            var wardType = await _dbContext.WardTypes.FirstOrDefaultAsync(wt => wt.Id == request.WardTypeId, cancellationToken);
            if (wardType == null)
            {
                throw new KeyNotFoundException("Ward Type not found.");
            }

            if (await _dbContext.Wards.AnyAsync(w =>
                w.DepartmentId == request.DepartmentId && w.WardNumber == request.WardNumber, 
                cancellationToken))
            {
                throw new InvalidOperationException("Ward with the same number already exists in this department.");
            }

            var ward = new Ward
            {
                Id = Guid.NewGuid(),
                DepartmentId = request.DepartmentId,
                WardTypeId = request.WardTypeId,
                WardNumber = request.WardNumber,
                GenderPolicy = request.GenderPolicy,
                MaxCapacity = request.MaxCapacity,
                Notes = request.Notes
            };

            _dbContext.Add(ward);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new WardResponse
            {
                Id = ward.Id,
                DepartmentId = ward.DepartmentId,
                DepartmentName = department.Name,
                WardTypeId = ward.WardTypeId,
                WardTypeName = wardType.Name,
                WardNumber = ward.WardNumber,
                GenderPolicy = ward.GenderPolicy,
                MaxCapacity = ward.MaxCapacity,
                Notes = ward.Notes
            };
        }
    }
}

public class CreateWardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/wards", async (CreateWardRequest request, ISender sender, IValidator<CreateWardRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new CreateWard.Command
            {
                DepartmentId = request.DepartmentId,
                WardTypeId = request.WardTypeId,
                WardNumber = request.WardNumber,
                GenderPolicy = request.GenderPolicy,
                MaxCapacity = request.MaxCapacity,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.Created($"/api/wards/{result.Id}", result);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Wards")
        .WithName("CreateWard")
        .WithDescription("Creates a new ward")
        .Produces<WardResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
