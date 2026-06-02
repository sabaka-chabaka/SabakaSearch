using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SabakaSearch.Domain.Entities;

namespace SabakaSearch.Infrastructure.Persistence.Configurations;

internal sealed class SearchQueryConfiguration : IEntityTypeConfiguration<SearchQuery>
{
    public void Configure(EntityTypeBuilder<SearchQuery> b)
    {
        b.ToTable("search_queries");

        b.HasKey(q => q.Id);
        b.Property(q => q.Id).HasColumnName("id");

        b.Property(q => q.UserId).HasColumnName("user_id");

        b.Property(q => q.RawQuery)
            .HasColumnName("raw_query")
            .HasMaxLength(512)
            .IsRequired();

        b.Property(q => q.NormalizedQuery)
            .HasColumnName("normalized_query")
            .HasMaxLength(512)
            .IsRequired();

        b.Property(q => q.ResultCount).HasColumnName("result_count");
        b.Property(q => q.ExecutionTime).HasColumnName("execution_time");
        b.Property(q => q.CreatedAt).HasColumnName("created_at");

        b.HasIndex(q => q.NormalizedQuery);
        b.HasIndex(q => q.CreatedAt);

        b.HasMany(q => q.Pages)
            .WithOne(p => p.SearchQuery)
            .HasForeignKey(p => p.SearchQueryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}