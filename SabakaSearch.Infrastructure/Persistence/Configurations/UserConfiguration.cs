using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SabakaSearch.Domain.Entities;

namespace SabakaSearch.Infrastructure.Persistence.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> b)
    {
        b.ToTable("users");

        b.HasKey(u => u.Id);
        b.Property(u => u.Id).HasColumnName("id");

        b.Property(u => u.Username)
            .HasColumnName("username")
            .HasMaxLength(64)
            .IsRequired();

        b.Property(u => u.Email)
            .HasColumnName("email")
            .HasMaxLength(256)
            .IsRequired();

        b.HasIndex(u => u.Email).IsUnique();

        b.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .IsRequired();

        b.Property(u => u.CreatedAt).HasColumnName("created_at");
        b.Property(u => u.LastLoginAt).HasColumnName("last_login_at");

        b.HasMany(u => u.SearchHistory)
            .WithOne(q => q.User!)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}