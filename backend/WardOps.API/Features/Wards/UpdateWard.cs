using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Wards;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Wards;

public static class UpdateWard
{
    public class Command : IRequest<WardResponse>
    {
        public Guid Id { get; set; }
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
            var ward = await _dbContext.Wards.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (ward == null)
            {
                throw new KeyNotFoundException("Ward not found.");
            }

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
                w.DepartmentId == request.DepartmentId && w.WardNumber == request.WardNumber && w.Id != request.Id,
                cancellationToken))
            {
                throw new InvalidOperationException("Ward with the same number already exists in this department.");
            }

            ward.DepartmentId = request.DepartmentId;
            ward.WardTypeId = request.WardTypeId;
            ward.WardNumber = request.WardNumber;
            ward.GenderPolicy = request.GenderPolicy;
            ward.MaxCapacity = request.MaxCapacity;
            ward.Notes = request.Notes;

            _dbContext.Update(ward);
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

public class UpdateWardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("api/wards/{id}", async ([FromRoute] Guid id, [FromBody] UpdateWardRequest request, ISender sender, IValidator<UpdateWardRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new UpdateWard.Command
            {
                Id = id,
                DepartmentId = request.DepartmentId,
                WardTypeId = request.WardTypeId,
                WardNumber = request.WardNumber,
                GenderPolicy = request.GenderPolicy,
                MaxCapacity = request.MaxCapacity,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.NoContent();
        })
        .WithTags("Wards")
        .WithName("UpdateWard")
        .WithDescription("Updates an existing ward")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
