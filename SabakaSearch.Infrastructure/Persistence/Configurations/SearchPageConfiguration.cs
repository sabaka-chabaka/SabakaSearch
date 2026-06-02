using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SabakaSearch.Domain.Entities;

namespace SabakaSearch.Infrastructure.Persistence.Configurations;

internal sealed class SearchPageConfiguration : IEntityTypeConfiguration<SearchPage>
{
    public void Configure(EntityTypeBuilder<SearchPage> b)
    {
        b.ToTable("search_pages");

        b.HasKey(p => p.Id);
        b.Property(p => p.Id).HasColumnName("id");

        b.Property(p => p.SearchQueryId).HasColumnName("search_query_id");

        b.Property(p => p.Url)
            .HasColumnName("url")
            .HasMaxLength(2048)
            .IsRequired();

        b.Property(p => p.Title)
            .HasColumnName("title")
            .HasMaxLength(512)
            .IsRequired();

        b.Property(p => p.Snippet)
            .HasColumnName("snippet")
            .HasMaxLength(1024);

        b.Property(p => p.RelevanceScore).HasColumnName("relevance_score");
        b.Property(p => p.Position).HasColumnName("position");
        b.Property(p => p.IndexedAt).HasColumnName("indexed_at");

        b.HasIndex(p => new { p.SearchQueryId, p.Position }).IsUnique();
    }
}