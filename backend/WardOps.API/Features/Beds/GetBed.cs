using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;

namespace WardOps.API.Features.Beds;

public static class GetBed
{
    public class Query : IRequest<BedResponse>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, BedResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        public async Task<BedResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var bed = await _dbContext.Beds
                .Include(b => b.Ward)
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
            {
                throw new KeyNotFoundException("Bed not found.");
            }

            return new BedResponse
            {
                Id = bed.Id,
                WardId = bed.WardId,
                WardNumber = bed.Ward.WardNumber,
                BedNumber = bed.BedNumber,
                Status = bed.Status,
                Notes = bed.Notes
            };
        }
    }
}

public class GetBedEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/beds/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var query = new GetBed.Query { Id = id };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Beds")
        .WithName("GetBed")
        .WithDescription("Get details of a specific bed by ID")
        .Produces<BedResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}